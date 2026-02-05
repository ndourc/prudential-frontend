export const offsiteProfilingAPI = {
  // Submit complete offsite profile
  submitProfile: async (data: any, files: File[]) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    const response = await fetch("/api/offsite/submit", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to submit profile");
    }

    return response.json();
  },

  // Save draft
  saveDraft: async (data: any) => {
    const response = await fetch("/api/offsite/draft", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to save draft");
    }

    return response.json();
  },

  // Load existing profile
  loadProfile: async (companyId: string, periodId: string) => {
    const response = await fetch(
      `/api/offsite/profile/${companyId}/${periodId}`
    );

    if (!response.ok) {
      throw new Error("Failed to load profile");
    }

    return response.json();
  },

  // Get company information
  getCompanyInfo: async (companyId: string) => {
    const response = await fetch(`/api/companies/${companyId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch company info");
    }

    return response.json();
  },

  // Upload single document
  uploadDocument: async (
    companyId: string,
    file: File,
    documentType: string
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);
    formData.append("companyId", companyId);

    const response = await fetch("/api/offsite/upload-document", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload document");
    }

    return response.json();
  },

  // Validate capital adequacy
  validateCapitalAdequacy: async (data: {
    netCapital: number;
    requiredCapital: number;
    adjustedLiquidCapital: number;
  }) => {
    const response = await fetch("/api/offsite/validate-capital", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to validate capital adequacy");
    }

    return response.json();
  },
};
