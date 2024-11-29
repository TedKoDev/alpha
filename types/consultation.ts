export enum ConsultationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export const getStatusText = (status: ConsultationStatus) => {
  switch (status) {
    case ConsultationStatus.PENDING:
      return '대기중';
    case ConsultationStatus.IN_PROGRESS:
      return '상담중';
    case ConsultationStatus.COMPLETED:
      return '완료됨';
    case ConsultationStatus.CANCELLED:
      return '취소됨';
    default:
      return status;
  }
};

export const getStatusColor = (status: ConsultationStatus) => {
  switch (status) {
    case ConsultationStatus.PENDING:
      return 'bg-yellow-100 text-yellow-600';
    case ConsultationStatus.IN_PROGRESS:
      return 'bg-blue-100 text-blue-600';
    case ConsultationStatus.COMPLETED:
      return 'bg-green-100 text-green-600';
    case ConsultationStatus.CANCELLED:
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};
