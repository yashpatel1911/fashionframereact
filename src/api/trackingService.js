import API_ENDPOINTS from "./apiConfig";

export const trackShipmentByAwb = async (awbCode, token) => {
    try {
        const response = await fetch(
            `${API_ENDPOINTS.TRACKBYAWB}${awbCode}/`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || "Failed to track shipment" };
        }
    } catch (error) {
        return { success: false, error: "Network error: " + error.message };
    }
};