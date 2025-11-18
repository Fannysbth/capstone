const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

class ProjectAPI {
  static async getMyProjectById(projectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch project: ${response.status}`);
      }

      const projectData = await response.json();
      
      return {
        id: projectData._id,
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        status: projectData.status,
        ownerId: projectData.ownerId,
        createdAt: projectData.createdAt,
        proposalDriveLink: projectData.proposalDriveLink
      };
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  static async getMyProjects() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/my-projects`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }

      const projectsData = await response.json();
      
      return projectsData.map(project => ({
        id: project._id,
        title: project.title,
        description: project.description,
        category: project.category,
        status: project.status,
        ownerId: project.ownerId,
        createdAt: project.createdAt
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }
}

export default ProjectAPI;