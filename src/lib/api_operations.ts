import { _api } from "./api";
import type { RangeParams } from "./types";



export async function load() {
    try {
        const res = await _api.get("/get_energy");
        return { energyData: res.data };
    } catch (error) {
        console.error("API Fetch Error:", error);
        return { energyData: [] };
    }
}


export async function _getRange(endpoint: "range", params: RangeParams) {
    try {
        const queryParams = {
            start_date: params.start_date,
            end_date: params.end_date,
            start_hour: params.start_hour ?? "00:00:00",
            end_hour: params.end_hour ?? "23:59:59",
            limit: params.limit ?? 12,
            offset: params.offset ?? 0,
        };

        const res = await _api.get(`/${endpoint}`, { params: queryParams });
        return { rangeData: res.data };
    } catch (error) {
        console.error("API Error:", error);
        return { rangeData: [] };
    }
}