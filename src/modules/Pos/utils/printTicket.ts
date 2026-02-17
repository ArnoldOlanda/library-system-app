import { API } from '@/api';
import printJS from 'print-js';

interface PrintTicketOptions {
  ventaId: string;
}

/**
 * Descarga el ticket de venta en formato PDF
 * @param options - Opciones que incluyen el ID de la venta y el token de autenticación
 */
export const downloadTicket = async ({ ventaId }: PrintTicketOptions): Promise<void> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const ticketUrl = `${apiUrl}/ventas/${ventaId}/ticket`;

    const response = await API.get(ticketUrl, {
      responseType: 'blob',
    });


    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${ventaId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al descargar el ticket:', error);
    alert('Error al descargar el ticket. Por favor, intente nuevamente.');
  }
};

/**
 * Imprime el ticket con autenticación mediante fetch previo
 * @param options - Opciones de impresión
 */
export const printTicketWithAuth = async ({ ventaId }: PrintTicketOptions): Promise<void> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const ticketUrl = `${apiUrl}/ventas/${ventaId}/ticket`;

    // Hacer fetch con autenticación
    const response = await API.get(ticketUrl, {
      responseType: 'blob',
    });

    // Crear blob URL temporal
    const blob = response.data;
    const blobUrl = window.URL.createObjectURL(blob);

    // Imprimir usando el blob URL
    printJS({
      printable: blobUrl,
      type: 'pdf',
      showModal: true,
      modalMessage: 'Preparando ticket para imprimir...',
      onError: (error) => {
        console.error('Error al imprimir el ticket:', error);
        alert('Error al imprimir el ticket. Por favor, intente nuevamente.');
        window.URL.revokeObjectURL(blobUrl);
      },
      onPrintDialogClose: () => {
        console.log('Diálogo de impresión cerrado');
        // Limpiar el blob URL después de imprimir
        window.URL.revokeObjectURL(blobUrl);
      },
      documentTitle: `Ticket de Venta ${ventaId}`,
    });
  } catch (error) {
    console.error('Error al imprimir el ticket:', error);
    alert('Error al imprimir el ticket. Por favor, intente nuevamente.');
  }
};
