const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

class RequestAPI {
  static async getIncomingRequests(projectId = null) {
    try {
      let requests = [];
      
      if (projectId) {
        // Get requests for specific project
        const response = await fetch(`${API_BASE_URL}/api/requests/projects/${projectId}/requests`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch requests: ${response.status}`);
        }

        const data = await response.json();
        
        // Transform BE data to FE format
        requests = data.map(request => ({
          id: request._id,
          projectId: request.projectId,
          projectTitle: request.projectId?.title || 'Unknown Project',
          requesterName: request.requesterId?.groupName || 'Unknown Group',
          subject: `Request untuk melanjutkan proyek`,
          message: request.message,
          status: request.approved === null ? 'Waiting for Response' : 
                  request.approved ? 'Approved' : 'Rejected',
          createdAt: request.createdAt,
          approved: request.approved,
          requesterId: request.requesterId
        }));
      } else {
        // Get all incoming requests for user's projects
        // You might need to implement this endpoint in BE
        // For now, return empty array
        requests = [];
      }

      return requests;
    } catch (error) {
      console.error('Error fetching incoming requests:', error);
      throw error;
    }
  }

  static async updateRequestStatus(requestId, status, reason = null) {
    try {
      // Find project ID first by getting the request details
      const requestResponse = await fetch(`${API_BASE_URL}/api/requests/${requestId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!requestResponse.ok) {
        throw new Error('Failed to fetch request details');
      }

      const requestData = await requestResponse.json();
      const projectId = requestData.projectId;

      if (status === 'Approved') {
        // Approve request
        const response = await fetch(
          `${API_BASE_URL}/api/requests/projects/${projectId}/request/${requestId}/approve`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to approve request');
        }

        const result = await response.json();
        
        // Transform response to match FE format
        return {
          id: requestId,
          status: 'Approved',
          approved: true,
          proposalLink: result.proposalLink
        };
      } else if (status === 'Rejected') {
        // Reject request
        const response = await fetch(
          `${API_BASE_URL}/api/requests/projects/${projectId}/requests/${requestId}/reject`,
          {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to reject request');
        }

        // For rejected requests, they are deleted from BE
        // So we just return the status
        return {
          id: requestId,
          status: 'Rejected',
          approved: false
        };
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  }

  static async getRequestDetail(requestId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/requests/${requestId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch request detail: ${response.status}`);
      }

      const requestData = await response.json();
      
      // Transform to FE format
      return {
        id: requestData._id,
        projectId: requestData.projectId,
        projectTitle: requestData.projectId?.title || 'Unknown Project',
        requesterName: requestData.requesterId?.groupName || 'Unknown Group',
        requesterDepartment: requestData.requesterId?.department || '',
        requesterYear: requestData.requesterId?.year || '',
        teamPhotoUrl: requestData.requesterId?.teamPhotoUrl || '',
        subject: `Request untuk melanjutkan proyek`,
        message: requestData.message,
        status: requestData.approved === null ? 'Waiting for Response' : 
                requestData.approved ? 'Approved' : 'Rejected',
        createdAt: requestData.createdAt,
        approved: requestData.approved,
        proposalLink: requestData.proposalLink
      };
    } catch (error) {
      console.error('Error fetching request detail:', error);
      throw error;
    }
  }
}

export default RequestAPI;