import { Component, OnDestroy, OnInit, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DecimalPipe, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReportUseCase } from '../../../domain/usecase/reports/report.usecase';
import { UserUseCase } from '../../../domain/usecase/users/user.usecase';
import { DishUseCase } from '../../../domain/usecase/dishes/dish.usecase';
import { StatusUseCase } from '../../../domain/usecase/statuses/status.usecase';
import { BranchUseCase } from '../../../domain/usecase/branches/branch.usecase';
import {
  ReportQuery,
  ReportDetailQuery,
  SalesReportResponse,
  ReportDetailItem,
  User,
  Dish,
  Status,
  Branch,
} from '../../../domain/models';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PieController,
  Tooltip,
  Legend,
  Title,
  Colors,
} from 'chart.js';

Chart.register(
  BarController, BarElement, CategoryScale, LinearScale,
  ArcElement, PieController, Tooltip, Legend, Title, Colors
);

type ViewMode = 'report' | 'detail' | 'document';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe, CurrencyPipe],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('groupedBarChart') groupedBarChartRef!: ElementRef<HTMLCanvasElement>;

  filterForm: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  viewMode = signal<ViewMode>('report');

  // Dropdown data
  users: User[] = [];
  dishes: Dish[] = [];
  statuses: Status[] = [];
  branches: Branch[] = [];

  reportData: SalesReportResponse | null = null;
  selectedRankingIds = new Set<number>();
  detailItems: ReportDetailItem[] = [];
  documentDetail: any = null;
  documentType = '';

  private barChart: Chart | null = null;
  private pieChart: Chart | null = null;
  private groupedBarChart: Chart | null = null;
  private chartsInitialized = false;

  constructor(
    private readonly reportUseCase: ReportUseCase,
    private readonly userUseCase: UserUseCase,
    private readonly dishUseCase: DishUseCase,
    private readonly statusUseCase: StatusUseCase,
    private readonly branchUseCase: BranchUseCase,
    private readonly fb: FormBuilder,
  ) {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    this.filterForm = this.fb.group({
      fechaInicio: [this.formatDate(firstDay), Validators.required],
      fechaFin:    [this.formatDate(today), Validators.required],
      usuId:       [''],
      plaId:       [''],
      estId:       [''],
      sedeId:      [''],
    });
  }

  ngOnInit(): void {
    this.loadDropdownData();
  }

  ngAfterViewInit(): void {
    this.chartsInitialized = true;
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private loadDropdownData(): void {
    const bigPage = { page: 1, pageSize: 500, sort: 'usuId', order: 'asc' as const };

    this.userUseCase.getAll({ pagination: { ...bigPage, sort: 'usuId' } }).subscribe({
      next: (res) => this.users = res?.results ?? [],
    });
    this.dishUseCase.getAll({ pagination: { ...bigPage, sort: 'plaId' } }).subscribe({
      next: (res) => this.dishes = res?.results ?? [],
    });
    this.statusUseCase.getAll({ pagination: { ...bigPage, sort: 'estId' } }).subscribe({
      next: (res) => this.statuses = res?.results ?? [],
    });
    this.branchUseCase.getAll({ pagination: { ...bigPage, sort: 'sedeId' } }).subscribe({
      next: (res) => this.branches = res?.results ?? [],
    });
  }

  executeSearch(): void {
    if (this.filterForm.invalid) return;

    const values = this.filterForm.value;
    if (values.fechaInicio > values.fechaFin) {
      this.errorMessage.set('La fecha de inicio debe ser menor a la fecha de fin');
      return;
    }
    const today = this.formatDate(new Date());
    if (values.fechaFin > today) {
      this.errorMessage.set('La fecha de fin no puede ser mayor a la fecha actual');
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);
    this.viewMode.set('report');
    this.selectedRankingIds.clear();

    const query: ReportQuery = {
      fechaInicio: values.fechaInicio,
      fechaFin: values.fechaFin,
      ...(values.usuId  && { usuId: +values.usuId }),
      ...(values.plaId  && { plaId: +values.plaId }),
      ...(values.estId  && { estId: +values.estId }),
      ...(values.sedeId && { sedeId: +values.sedeId }),
    };

    this.reportUseCase.getSalesReport(query).subscribe({
      next: (res) => {
        this.reportData = res.results;
        this.loading.set(false);
        setTimeout(() => this.renderCharts(), 0);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.detail ?? 'Error al consultar el reporte');
        this.loading.set(false);
      },
    });
  }

  toggleRankingSelection(id: number): void {
    if (this.selectedRankingIds.has(id)) {
      this.selectedRankingIds.delete(id);
    } else {
      this.selectedRankingIds.add(id);
    }
  }

  isSelected(id: number): boolean {
    return this.selectedRankingIds.has(id);
  }

  toggleSelectAll(): void {
    if (!this.reportData) return;
    if (this.selectedRankingIds.size === this.reportData.ranking.length) {
      this.selectedRankingIds.clear();
    } else {
      this.reportData.ranking.forEach(item => this.selectedRankingIds.add(item.id));
    }
  }

  isAllSelected(): boolean {
    return !!this.reportData && this.selectedRankingIds.size === this.reportData.ranking.length;
  }

  viewDetail(): void {
    if (this.selectedRankingIds.size === 0) {
      this.errorMessage.set('Seleccione al menos un plato del ranking');
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    const values = this.filterForm.value;
    const query: ReportDetailQuery = {
      plaIds: Array.from(this.selectedRankingIds),
      fechaInicio: values.fechaInicio,
      fechaFin: values.fechaFin,
      ...(values.sedeId && { sedeId: +values.sedeId }),
      ...(values.usuId  && { usuId: +values.usuId }),
    };

    this.reportUseCase.getReportDetail(query).subscribe({
      next: (res) => {
        this.detailItems = res.results ?? [];
        this.viewMode.set('detail');
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.detail ?? 'Error al consultar el detalle');
        this.loading.set(false);
      },
    });
  }

  viewDocument(item: ReportDetailItem): void {
    this.loading.set(true);
    this.documentType = item.tipoDocumento;

    const obs = item.tipoDocumento === 'PEDIDO'
      ? this.reportUseCase.getOrderDetail(item.documentoId)
      : this.reportUseCase.getCashReceiptDetail(item.documentoId);

    obs.subscribe({
      next: (res) => {
        this.documentDetail = res.results;
        this.viewMode.set('document');
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.detail ?? 'Error al consultar el documento');
        this.loading.set(false);
      },
    });
  }

  goBackToReport(): void {
    this.viewMode.set('report');
    setTimeout(() => this.renderCharts(), 0);
  }

  goBackToDetail(): void {
    this.viewMode.set('detail');
  }

  // ── Chart rendering ──

  private renderCharts(): void {
    if (!this.reportData || !this.chartsInitialized) return;
    this.destroyCharts();

    this.renderBarChart();
    this.renderPieChart();
    this.renderGroupedBarChart();
  }

  private renderBarChart(): void {
    const data = this.reportData!.graficos.barrasMensual;
    if (!data?.length || !this.barChartRef) return;

    const ctx = this.barChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => `${d.nombreMes} ${d.anio}`),
        datasets: [{
          label: 'Cantidad vendida',
          data: data.map(d => d.cantidad),
          backgroundColor: 'rgba(201, 165, 90, 0.7)',
          borderColor: '#c9a55a',
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#f0e8db' } },
          title: { display: true, text: 'Cantidad por Mes', color: '#f0e8db',
                   font: { family: "'Cormorant Garamond', serif", size: 16, weight: 'bold' } },
        },
        scales: {
          x: { ticks: { color: '#7a6e62' }, grid: { color: '#2e2720' } },
          y: { ticks: { color: '#7a6e62' }, grid: { color: '#2e2720' }, beginAtZero: true },
        },
      },
    });
  }

  private renderPieChart(): void {
    const data = this.reportData!.graficos.circular;
    if (!data?.length || !this.pieChartRef) return;

    const ctx = this.pieChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const colors = ['#c9a55a', '#a07c38', '#27ae60', '#2980b9', '#8e44ad'];

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(d => d.descripcion),
        datasets: [{
          data: data.map(d => d.cantidad),
          backgroundColor: colors,
          borderColor: '#181410',
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#f0e8db', padding: 12 } },
          title: { display: true, text: 'Consolidado General', color: '#f0e8db',
                   font: { family: "'Cormorant Garamond', serif", size: 16, weight: 'bold' } },
        },
      },
    });
  }

  private renderGroupedBarChart(): void {
    const data = this.reportData!.graficos.barrasAgrupadas;
    if (!data?.length || !this.groupedBarChartRef) return;

    const ctx = this.groupedBarChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const branches = [...new Set(data.map(d => d.sedeNombre))];
    const months = [...new Set(data.map(d => `${d.nombreMes} ${d.anio}`))];
    const colors = ['#c9a55a', '#27ae60', '#2980b9', '#8e44ad', '#e67e22'];

    const datasets = branches.map((branch, i) => ({
      label: branch,
      data: months.map(month => {
        const item = data.find(d => d.sedeNombre === branch && `${d.nombreMes} ${d.anio}` === month);
        return item ? item.cantidad : 0;
      }),
      backgroundColor: colors[i % colors.length] + 'B3',
      borderColor: colors[i % colors.length],
      borderWidth: 1,
      borderRadius: 4,
    }));

    this.groupedBarChart = new Chart(ctx, {
      type: 'bar',
      data: { labels: months, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#f0e8db' } },
          title: { display: true, text: 'Comparación por Sede y Mes', color: '#f0e8db',
                   font: { family: "'Cormorant Garamond', serif", size: 16, weight: 'bold' } },
        },
        scales: {
          x: { ticks: { color: '#7a6e62' }, grid: { color: '#2e2720' } },
          y: { ticks: { color: '#7a6e62' }, grid: { color: '#2e2720' }, beginAtZero: true },
        },
      },
    });
  }

  private destroyCharts(): void {
    this.barChart?.destroy();
    this.pieChart?.destroy();
    this.groupedBarChart?.destroy();
    this.barChart = null;
    this.pieChart = null;
    this.groupedBarChart = null;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getDocumentProperties(): { key: string; label: string; value: any }[] {
    if (!this.documentDetail) return [];
    const props: { key: string; label: string; value: any }[] = [];
    for (const [key, value] of Object.entries(this.documentDetail)) {
      if (value !== null && value !== undefined) {
        props.push({ key, label: this.formatLabel(key), value });
      }
    }
    return props;
  }

  private formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase())
      .trim();
  }
}
