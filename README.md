# Landing Page - Bautizo de David Gael 🕊️

Una hermosa landing page con colores pasteles para celebrar el bautizo de David Gael.

## 🎨 Características

- **Diseño elegante** con colores pasteles (azul cielo, lavanda, crema) que evocan pureza y paz
- **Sección Hero** con animaciones suaves
- **Detalles del evento** con tarjetas informativas
- **Mapa de Google Maps** integrado para mostrar la ubicación
- **Formulario de confirmación de asistencia** con validación
- **Diseño responsive** que se adapta a móviles y tablets
- **Animaciones suaves** al hacer scroll

## 📋 Configuración Necesaria

### 1. Configurar el Correo Electrónico

Para recibir las confirmaciones de asistencia, necesitas configurar tu correo electrónico:

#### Opción A: Usar FormSubmit.co (Recomendado - Gratis)

1. Abre el archivo [`script.js`](script.js:73)
2. Busca la línea 73: `const formSubmitUrl = 'https://formsubmit.co/ajax/YOUR_EMAIL@example.com';`
3. Reemplaza `YOUR_EMAIL@example.com` con tu correo electrónico real
4. La primera vez que alguien envíe el formulario, FormSubmit te enviará un email de confirmación
5. Haz clic en el enlace de confirmación y ¡listo!

**Ejemplo:**

```javascript
const formSubmitUrl = "https://formsubmit.co/ajax/carlos@example.com";
```

#### Opción B: Email Manual (Fallback)

Si FormSubmit no funciona, el sistema abrirá automáticamente el cliente de correo del usuario con los datos pre-llenados.

También necesitas actualizar la línea 119 en [`script.js`](script.js:119):

```javascript
window.location.href = `mailto:TU_EMAIL@example.com?subject=${subject}&body=${body}`;
```

### 2. Configurar el Mapa de Google

1. Ve a [Google Maps](https://www.google.com/maps)
2. Busca la ubicación de la iglesia o lugar del evento
3. Haz clic en "Compartir" → "Insertar un mapa"
4. Copia el código iframe
5. Abre [`index.html`](index.html:88)
6. Reemplaza el iframe existente (línea 88-95) con tu código

**Ejemplo de cómo obtener el código:**

- Busca la dirección en Google Maps
- Clic en "Compartir"
- Selecciona "Insertar un mapa"
- Copia el código `<iframe>...</iframe>`
- Pégalo en el HTML

### 3. Actualizar Detalles del Evento

Edita el archivo [`index.html`](index.html:47) para actualizar:

- **Fecha** (línea 47-49): Cambia "Próximamente" por la fecha real
- **Hora** (línea 50-52): Cambia "Por confirmar" por la hora del evento
- **Lugar** (línea 53-55): Cambia "Iglesia" por el nombre completo del lugar

**Ejemplo:**

```html
<div class="detail-card">
  <div class="detail-icon">📅</div>
  <h3>Fecha</h3>
  <p>Sábado, 15 de Marzo de 2026</p>
</div>
```

## 🚀 Cómo Usar

### Opción 1: Abrir Directamente

1. Simplemente abre el archivo [`index.html`](index.html) en tu navegador
2. La página funcionará localmente

### Opción 2: Publicar en Internet (Gratis)

#### Usando GitHub Pages:

1. Crea una cuenta en [GitHub](https://github.com)
2. Crea un nuevo repositorio
3. Sube los archivos: `index.html`, `styles.css`, `script.js`
4. Ve a Settings → Pages
5. Selecciona la rama "main" y guarda
6. Tu sitio estará disponible en: `https://tu-usuario.github.io/nombre-repositorio`

#### Usando Netlify:

1. Ve a [Netlify](https://www.netlify.com)
2. Arrastra la carpeta con los archivos
3. ¡Listo! Obtendrás una URL gratuita

#### Usando Vercel:

1. Ve a [Vercel](https://vercel.com)
2. Importa el proyecto
3. Despliega con un clic

## 📱 Características del Formulario

El formulario de confirmación incluye:

- ✅ Validación de campos obligatorios
- ✅ Validación de formato de email
- ✅ Validación de número de teléfono
- ✅ Campo para número de acompañantes
- ✅ Campo opcional para mensajes
- ✅ Mensajes de éxito/error
- ✅ Envío automático por email

## 🎨 Personalización de Colores

Si deseas cambiar los colores, edita las variables CSS en [`styles.css`](styles.css:11) (líneas 11-21):

```css
:root {
  --primary-color: #e8f4f8; /* Azul cielo suave */
  --secondary-color: #fff9f0; /* Crema cálido */
  --accent-color: #d4e8f0; /* Azul claro */
  --text-primary: #5a6c7d; /* Gris-azul suave */
  --text-secondary: #8b9daf; /* Gris-azul claro */
  --soft-pink: #ffe8e8; /* Rosa suave */
  --soft-lavender: #e8e4f3; /* Lavanda suave */
  --soft-mint: #e0f2e9; /* Menta suave */
  --gold-accent: #d4af37; /* Dorado suave */
}
```

## 📂 Estructura de Archivos

```
mi-bautizo/
│
├── index.html          # Estructura principal de la página
├── styles.css          # Estilos y diseño
├── script.js           # Funcionalidad y validación del formulario
└── README.md           # Este archivo
```

## 🌐 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (últimas versiones)
- ✅ Dispositivos móviles (iOS y Android)
- ✅ Tablets
- ✅ Diseño responsive

## 💡 Consejos

1. **Prueba el formulario** antes de compartir la página
2. **Verifica el mapa** para asegurarte de que muestra la ubicación correcta
3. **Comparte la URL** con tus invitados por WhatsApp, email o redes sociales
4. **Revisa tu correo** regularmente para ver las confirmaciones

## 🆘 Solución de Problemas

### El formulario no envía emails

- Verifica que hayas configurado tu email en [`script.js`](script.js:73)
- Confirma tu email en FormSubmit la primera vez
- Revisa la consola del navegador (F12) para ver errores

### El mapa no se muestra

- Verifica que el código iframe esté completo
- Asegúrate de tener conexión a internet
- Algunos navegadores bloquean iframes, verifica la configuración

### Los colores no se ven bien

- Asegúrate de que [`styles.css`](styles.css) esté en la misma carpeta que [`index.html`](index.html)
- Limpia la caché del navegador (Ctrl + F5)

## 📞 Soporte

Si tienes problemas, verifica:

1. Que todos los archivos estén en la misma carpeta
2. Que hayas configurado tu email en el script
3. Que el mapa tenga las coordenadas correctas

---

**¡Que Dios bendiga el bautizo de David Gael! 🕊️✨**
