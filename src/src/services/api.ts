export interface Job {
  company: string;
  position: string;
  status: string;
  timePassed: string;
}

// Mock data
const mockJobs: Job[] = [
  { company: 'Google', position: 'Software Engineer', status: 'Applied', timePassed: '2 days ago' },
  { company: 'Facebook', position: 'Data Scientist', status: 'Interviewing', timePassed: '5 days ago' },
  { company: 'Amazon', position: 'DevOps Engineer', status: 'Rejected', timePassed: '1 week ago' },
];

export const fetchJobs = async (): Promise<Job[]> => {
  // Simulate a delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockJobs), 1000);
  });
};

export const createJob = async (job: Job): Promise<void> => {
  // Simulate successful job creation
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 1000);
  });
};

// Mock profile submission
export const submitProfile = async (profileData: any): Promise<void> => {
  // Simulate a delay and successful profile submission
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 1000);
  });
};
