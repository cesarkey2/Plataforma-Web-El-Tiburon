
## 12. Registro e inicio de sesión local

La versión actual permite crear cuentas directamente en MySQL de XAMPP, sin depender de OAuth. Después de aplicar la migración nueva:

```powershell
pnpm db:migrate
```

se puede usar `/registro` para crear una cuenta y `/login` para iniciar sesión. Las contraseñas se almacenan como hash, no en texto plano. El primer registro obtiene el rol `user`; el rol `admin` debe asignarse de forma controlada en MySQL cuando sea necesario para la demostración.

Para asignar un administrador en phpMyAdmin, primero registra la cuenta desde `/registro` y luego ejecuta, reemplazando el correo:

```sql
UPDATE users SET role = 'admin' WHERE email = 'tu-correo@dominio.com';
```

## 13. Envío opcional con FormSubmit

Los reclamos y mensajes de contacto siempre se guardan en MySQL. Además, se puede activar un aviso por correo usando FormSubmit.

En `.env` agrega el correo real de El Tiburón:

```env
FORMSUBMIT_EMAIL=tu-correo@dominio.com
```

No uses el correo del sistema anterior. FormSubmit puede solicitar una confirmación inicial del correo receptor. Si el servicio no responde o no está configurado, el registro en MySQL se conserva y el sistema no pierde la información.
