export interface Media {
  id: string;
  created_at: Date;
  updated_at: Date;
  fileName: string;
  filePath: string;
  isTemp: boolean;
  uploaded_on: Date;
}
