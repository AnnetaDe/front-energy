export interface RangeParams {
    start_date: string;
    end_date: string;
    start_hour?: string;
    end_hour?: string;
    limit?: number;
    offset?: number;

}

export interface RangeResponse {
    count: number;
    per_page: number;
    page: number;
    total_pages: number;
    offset: number;
    total_items: number;
    data: any[];
    total: number;
}

