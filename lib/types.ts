export interface Employee {
  id: string;
  name: string;
  email: string;

  department:
    | string
    | {
        id: string;
        name: string;
        code: string;
        description: string | null;
        createdAt: string;
      };

  designation: string;
  joiningDate: string;
  status: "Active" | "Inactive";
}