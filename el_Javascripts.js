const { google } = require('googleapis');
const axios = require('axios');

exports.handler = async (event, context) => {
    try {
        // Autenticación con la API de Google
        const auth = new google.auth.GoogleAuth({
            // Coloca aquí las credenciales de servicio de Google
            // Debes configurar estas credenciales en la consola de Google Cloud
            credentials: {
                client_email: 'tu-client-email',
                private_key: 'tu-private-key'
            },
            scopes: ['https://www.googleapis.com/auth/analytics.readonly']
        });

        const analytics = google.analyticsreporting({ version: 'v4', auth });

        // Configura el request para obtener los datos de las páginas más visitadas
        const response = await analytics.reports.batchGet({
            requestBody: {
                reportRequests: [
                    {
                        viewId: 'tu-view-id',
                        dateRanges: [
                            {
                                startDate: '2024-02-01',
                                endDate: '2024-02-19'
                            }
                        ],
                        metrics: [
                            {
                                expression: 'ga:pageviews'
                            }
                        ],
                        dimensions: [
                            {
                                name: 'ga:pagePath'
                            }
                        ],
                        orderBys: [
                            {
                                fieldName: 'ga:pageviews',
                                sortOrder: 'DESCENDING'
                            }
                        ],
                        pageSize: 10
                    }
                ]
            }
        });

        // Procesa la respuesta y devuelve los datos de las páginas más visitadas
        const pageViews = response.data.reports[0].data.rows.map(row => ({
            pagePath: row.dimensions[0],
            pageViews: parseInt(row.metrics[0].values[0])
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(pageViews)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Hubo un error al procesar la solicitud' })
        };
    }
};
