export interface RangeParams {
    start_date: string;
    end_date: string;
    start_hour?: string;
    end_hour?: string;
    limit?: number;
    offset?: number;

}

export interface RangeResponse {
    limit: number;
    total: number;
    offset: number;
    total_items: number;
    items: any[];

}

