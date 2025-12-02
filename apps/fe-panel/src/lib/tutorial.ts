import { driver } from "driver.js";

export const startTutorial = () => {
  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    doneBtnText: 'Finalizar',
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    steps: [
      { 
        popover: { 
          title: 'Bienvenido a Laurio', 
          description: 'Esta es tu nueva plataforma de orquestación de contenido. Te guiaremos por las funciones principales para que puedas empezar a crear de inmediato.',
          side: "left", 
          align: 'start'
        } 
      },
      { 
        element: '#nav-dashboard', 
        popover: { 
          title: 'Dashboard Principal', 
          description: 'Aquí tendrás una vista general de tus estadísticas, contenido reciente y métricas de rendimiento.',
          side: "right", 
          align: 'center'
        } 
      },
      { 
        element: '#stats-grid', 
        popover: { 
          title: 'Métricas Clave', 
          description: 'Visualiza rápidamente el total de artículos, posts generados, eficiencia y otras métricas importantes para tu flujo de trabajo.',
          side: "bottom", 
          align: 'center'
        } 
      },
      { 
        element: '#btn-new-batch', 
        popover: { 
          title: 'Crear Nuevo Contenido', 
          description: 'Haz clic aquí para iniciar el asistente de generación. Podrás crear artículos de blog y posts para redes sociales en segundos.',
          side: "bottom", 
          align: 'center'
        } 
      },
      { 
        element: '#backlog-section', 
        popover: { 
          title: 'Tu Backlog', 
          description: 'Gestiona tus ideas, borradores y contenidos programados. Filtra por estado para mantener todo organizado.',
          side: "top", 
          align: 'center'
        } 
      },
      { 
        element: '#nav-generar', 
        popover: { 
          title: 'Generador', 
          description: 'Acceso directo a la herramienta de creación de contenido.',
          side: "right", 
          align: 'center'
        } 
      },
      { 
        element: '#nav-backlog', 
        popover: { 
          title: 'Gestión de Backlog', 
          description: 'Ve al listado completo de tus contenidos para editar, aprobar o eliminar items.',
          side: "right", 
          align: 'center'
        } 
      },
      { 
        popover: { 
          title: '¡Todo listo!', 
          description: 'Ya conoces lo básico. Explora la plataforma y empieza a crear contenido increíble con Laurio.',
          side: "left", 
          align: 'start'
        } 
      }
    ],
    onDestroyStarted: () => {
      if (!driverObj.hasNextStep() || confirm("¿Quieres salir del tutorial?")) {
        driverObj.destroy();
        localStorage.setItem('tutorial_seen', 'true');
      }
    },
  });

  driverObj.drive();
};
