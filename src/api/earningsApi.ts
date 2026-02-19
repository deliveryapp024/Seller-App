import { apiClient, ApiResponse } from './client';

export interface EarningsSummary {
  today: number;
  yesterday: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  ordersCount?: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export interface EarningsSummaryResponse {
  summary: EarningsSummary;
}

export interface Payout {
  _id: string;
  cycleNumber: number;
  startDate: string;
  endDate: string;
  totalOrders: number;
  totalRevenue: number;
  commission: number;
  deliveryFee: number;
  packagingFee: number;
  adjustments: number;
  netPayout: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
}

export interface PayoutsResponse {
  payouts: Payout[];
  totalPayouts: number;
  totalPages: number;
  currentPage: number;
}

export interface FeeBreakdown {
  commission: number;
  commissionRate: number;
  deliveryFee: number;
  packagingFee: number;
  platformFee: number;
  tax: number;
  totalDeductions: number;
  netEarnings: number;
}

export interface DailyEarning {
  date: string;
  orders: number;
  revenue: number;
  commission?: number;
  netEarnings?: number;
}

export interface DailyEarningsResponse {
  dailyEarnings: DailyEarning[];
}

export interface WeeklyEarningsResponse {
  weekStart: string;
  weekEnd: string;
  dailyBreakdown: Array<{
    day: string;
    revenue: number;
    orders: number;
  }>;
  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalCommission?: number;
    netEarnings?: number;
  };
}

export interface MonthlyEarningsResponse {
  month: number;
  year: number;
  dailyBreakdown: Array<{
    day: number;
    revenue: number;
    orders: number;
  }>;
  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalCommission?: number;
    netEarnings?: number;
  };
}

export interface AvailableBalance {
  balance: number;
  pendingAmount: number;
  currency: string;
  lastPayoutAmount?: number;
  lastPayoutDate?: string;
}

export interface WithdrawalRequest {
  amount: number;
  bankAccountId: string;
}

export interface WithdrawalResponse {
  message: string;
  withdrawal: {
    _id: string;
    amount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    requestedAt: string;
    estimatedCompletion?: string;
  };
}

// Get earnings summary (today, this week, this month)
export const getEarningsSummary = async (): Promise<ApiResponse<EarningsSummaryResponse>> => {
  return apiClient.get<EarningsSummaryResponse>('/seller/earnings/summary');
};

// Get daily earnings for a date range
export const getDailyEarnings = async (
  startDate: string,
  endDate: string
): Promise<ApiResponse<DailyEarningsResponse>> => {
  return apiClient.get<DailyEarningsResponse>(
    `/seller/earnings/daily?startDate=${startDate}&endDate=${endDate}`
  );
};

// Get weekly earnings breakdown
export const getWeeklyEarnings = async (
  weekStart?: string
): Promise<ApiResponse<WeeklyEarningsResponse>> => {
  let endpoint = '/seller/earnings/weekly';
  if (weekStart) {
    endpoint += `?weekStart=${weekStart}`;
  }
  return apiClient.get<WeeklyEarningsResponse>(endpoint);
};

// Get monthly earnings breakdown
export const getMonthlyEarnings = async (
  year?: number,
  month?: number
): Promise<ApiResponse<MonthlyEarningsResponse>> => {
  let endpoint = '/seller/earnings/monthly';
  const params: string[] = [];
  if (year) params.push(`year=${year}`);
  if (month) params.push(`month=${month}`);
  if (params.length > 0) {
    endpoint += `?${params.join('&')}`;
  }
  return apiClient.get<MonthlyEarningsResponse>(endpoint);
};

// Get fee breakdown for a period
export const getFeeBreakdown = async (
  startDate: string,
  endDate: string
): Promise<ApiResponse<FeeBreakdown>> => {
  return apiClient.get<FeeBreakdown>(
    `/seller/earnings/fees?startDate=${startDate}&endDate=${endDate}`
  );
};

// Get available balance for withdrawal
export const getAvailableBalance = async (): Promise<ApiResponse<AvailableBalance>> => {
  return apiClient.get<AvailableBalance>('/seller/earnings/balance');
};

// Request withdrawal (coming soon)
export const requestWithdrawal = async (
  data: WithdrawalRequest
): Promise<ApiResponse<WithdrawalResponse>> => {
  void data;
  return {
    success: false,
    error: 'Withdrawal is not supported yet on this environment.',
  };
};

// Get payout history (coming soon)
export const getPayouts = async (
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<PayoutsResponse>> => {
  void page;
  void limit;
  return {
    success: false,
    error: 'Payout history is not supported yet on this environment.',
  };
};

// Get payout details by ID (coming soon)
export const getPayoutDetails = async (
  payoutId: string
): Promise<ApiResponse<{ payout: Payout; orders: unknown[] }>> => {
  void payoutId;
  return {
    success: false,
    error: 'Payout details are not supported yet on this environment.',
  };
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return `Rs.${amount.toLocaleString('en-IN')}`;
};

// Helper function to format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Helper function to format date range
export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startStr = start.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });

  const endStr = end.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return `${startStr} - ${endStr}`;
};

// Helper function to get payout status color
export const getPayoutStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return '#00C853';
    case 'processing':
      return '#FFB300';
    case 'pending':
      return '#FF5252';
    case 'failed':
      return '#FF5252';
    default:
      return '#9E9E9E';
  }
};

// Helper function to get payout status icon
export const getPayoutStatusIcon = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'check-circle';
    case 'processing':
      return 'clock';
    case 'pending':
      return 'alert-circle';
    case 'failed':
      return 'x-circle';
    default:
      return 'help-circle';
  }
};

// Calculate percentage change
export const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

// Generate chart data from daily earnings
export const generateChartData = (
  dailyBreakdown: DailyEarning[],
  days: number = 7
): { label: string; value: number }[] => {
  const lastNDays = dailyBreakdown.slice(-days);

  return lastNDays.map((day) => {
    const date = new Date(day.date);
    const label = date.toLocaleDateString('en-IN', { weekday: 'short' });
    return {
      label,
      value: day.netEarnings ?? day.revenue,
    };
  });
};
