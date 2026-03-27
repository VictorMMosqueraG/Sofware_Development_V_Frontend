# SoftwareDevelopmentVFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

## Agent Capabilities and Limitations

This project uses a GitHub Copilot coding agent to assist with development tasks. The following section explains what the agent **can** and **cannot** do regarding system access, authentication, and data privacy.

### What the agent CAN do

- Read and modify source files within this repository.
- Run CLI commands (build, test, lint) in the sandboxed environment.
- Use provided tools (grep, file view/edit, bash) to explore and update code.
- Generate documentation, UI components, and unit tests.
- Suggest code improvements and refactors.

### What the agent CANNOT do

- **Log into or access any external system** (e.g., banking portals, social media, email accounts, ERP systems, third-party APIs that require user credentials).
- Store, retrieve, or transmit your personal passwords or authentication tokens.
- Perform actions on your behalf on websites or platforms outside the repository sandbox.
- Access data that has not been explicitly shared in the current conversation/session.
- Persist sensitive information between sessions.

### Security best practices

- **Never share passwords, API keys, or personal credentials** with the agent in chat messages.
- If you need the agent to interact with an external service, use official integrations (e.g., GitHub Actions secrets, environment variables) — never paste credentials directly.
- Prefer sharing **screenshots, logs, or anonymized data** when you need the agent to diagnose a problem that involves external systems.
- Review all agent-generated code before merging it to production.

### Safe alternatives for system interaction

| Scenario | Safe alternative |
|---|---|
| Diagnose a login issue | Share a screenshot or sanitized log with the agent |
| Test an API integration | Use a local `.env` file (never committed) and run tests yourself |
| Update credentials | Change them directly through the official platform UI |
| Automate deployments | Use GitHub Actions with encrypted secrets |

---

## Preguntas Frecuentes (FAQ en Español)

### ¿Como agente puedes ingresar algún sistema?

**No.** El agente **no puede** iniciar sesión ni acceder a sistemas externos por ti. Sus capacidades están limitadas a:

- Leer y editar archivos dentro de este repositorio.
- Ejecutar comandos de construcción, pruebas y análisis de código en un entorno aislado (sandbox).
- Generar documentación, componentes y pruebas unitarias.

**¿Qué NO puede hacer el agente?**

- Ingresar a portales bancarios, plataformas de redes sociales, sistemas ERP u otros servicios externos.
- Almacenar ni transmitir tus contraseñas o tokens de autenticación.
- Realizar acciones en tu nombre en sitios web fuera del repositorio.

**¿Qué debo hacer si necesito ayuda con un sistema externo?**

1. **Comparte capturas de pantalla o registros (logs)** del problema en el chat para que el agente pueda orientarte.
2. Usa las **integraciones oficiales** del servicio (p. ej., GitHub Actions con secretos cifrados).
3. Configura las credenciales directamente en la plataforma oficial; nunca las compartas en el chat.

> ⚠️ **Importante:** Por seguridad, nunca compartas contraseñas, claves de API ni datos personales sensibles con ningún agente de IA.
