export interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: FirebaseFirestore.Timestamp;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'admin' | 'user';
}
