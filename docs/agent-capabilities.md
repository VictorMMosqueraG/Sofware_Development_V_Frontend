# Agent Capabilities and Limitations

This document describes what the GitHub Copilot coding agent **can** and **cannot** do when assisting with this project, with a focus on system access, authentication, and data privacy.

---

## What the agent CAN do

- Read and modify source files within this repository.
- Run CLI commands (build, test, lint) in the sandboxed environment.
- Use repository tools (grep, file view/edit, bash) to explore and update code.
- Generate documentation, UI components, and unit tests.
- Suggest code improvements, refactors, and security best practices.
- Help interpret screenshots, logs, or anonymized data you share in the chat.

---

## What the agent CANNOT do

| Capability | Status |
|---|---|
| Log into external websites or portals | ❌ Not possible |
| Access third-party APIs using your credentials | ❌ Not possible |
| Read or send emails / messages on your behalf | ❌ Not possible |
| Store passwords or tokens between sessions | ❌ Not possible |
| Access data outside the current repository sandbox | ❌ Not possible |
| Perform browser automation against live systems | ❌ Not possible |

---

## Security best practices

1. **Never share passwords, API keys, or personal credentials** in the chat. The agent does not need them, and sharing them exposes you to risk.
2. Use **environment variables** and **GitHub Actions secrets** for any credential-dependent workflows — never hard-code secrets in source files.
3. Share **screenshots or sanitized logs** instead of raw credentials when troubleshooting.
4. Always **review agent-generated code** before merging to production.
5. Rotate any credentials that were accidentally shared immediately.

---

## Safe alternatives for common scenarios

| Scenario | Safe alternative |
|---|---|
| Debug a login/auth issue | Share a sanitized screenshot or error log with the agent |
| Test an API integration | Use a local `.env` file (add it to `.gitignore`) and run tests yourself |
| Update service credentials | Change them directly in the official platform UI |
| Automate deployments | Use GitHub Actions with encrypted repository secrets |
| Access a protected database | Set up a read-only test database and share anonymized query results |

---

## FAQ (English)

### Can the agent log into a system on my behalf?

No. The agent operates in an isolated sandbox and has no ability to open a browser session, submit login forms, or use your credentials on any external system.

### Can the agent access my emails or messages?

No. The agent only has access to the files in this repository and the tools explicitly provided to it.

### What should I do if I need help with an external system?

Share a screenshot, error message, or anonymized log in the chat. The agent can analyze it and suggest steps for you to perform manually.

---

## Preguntas Frecuentes (FAQ en Español)

### ¿Como agente puedes ingresar algún sistema?

**No.** El agente **no puede** iniciar sesión ni acceder a sistemas externos. Opera en un entorno aislado (sandbox) sin acceso a navegadores, credenciales ni servicios de terceros.

Sus capacidades se limitan a:

- Leer y editar archivos dentro de este repositorio.
- Ejecutar comandos de compilación, pruebas y análisis en el sandbox.
- Generar código, documentación y sugerencias de mejora.

### ¿Puede el agente usar mis contraseñas o tokens?

**No.** El agente no almacena ni transmite credenciales. Si compartes una contraseña en el chat por error, cámbiala de inmediato en el servicio correspondiente.

### ¿Qué puedo hacer si necesito que el agente me ayude con un sistema externo?

1. Comparte una **captura de pantalla** o **registro de errores** (log) en el chat.
2. El agente analizará la información y te indicará los pasos que tú debes seguir manualmente.
3. Para integraciones automatizadas, usa las herramientas oficiales (p. ej., GitHub Actions con secretos cifrados).

### ¿Es seguro usar el agente?

Sí, siempre que sigas estas prácticas:

- Nunca compartas contraseñas, tokens ni datos sensibles en el chat.
- Revisa el código generado antes de desplegarlo en producción.
- Usa integraciones oficiales para manejar credenciales.

> ⚠️ **Aviso de seguridad:** Ningún agente de IA legítimo te pedirá tu contraseña. Si alguien lo hace, es una señal de alerta.
