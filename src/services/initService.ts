import { SubjectService } from './subjectService';

export class InitService {
  private static initialized = false;

  static async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('Initializing database...');

      const result = await SubjectService.seedSubjects();
      console.log(result.message);

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }
}
