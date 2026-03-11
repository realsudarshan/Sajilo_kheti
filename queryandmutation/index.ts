import { trpc } from "../lib/trpc";

// ============================================================================
// USER HOOKS
// ============================================================================
export const useGetAllUsers = () => trpc.user.getAllUser.useQuery();
export const useCreateUser = () => trpc.user.createUser.useMutation();
export const useUpgradeRequest = () => trpc.user.upgradeRequest.useMutation();
export const useUpdateKycStatus = () => trpc.user.updateKycStatus.useMutation();
export const useGetKycDetails = () => trpc.user.getKycDetails.useQuery();
export const useGetAllKycDetails = () => trpc.user.getAllKycDetails.useQuery();
export const useGetMe = () => trpc.user.getMe.useQuery();

// ============================================================================
// LAND HOOKS
// ============================================================================
export const usePublishLand = () => trpc.land.publish.useMutation();

export const useSearchLands = (filters: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
}) => trpc.land.search.useQuery(filters);

export const useLands = () => {
    const query = trpc.land.search.useQuery({});
    return {
        ...query,
        data: query.data?.lands
    };
};

export const useGetLandById = (landId: string) => {
    return trpc.land.getById.useQuery({ landId }, {
        enabled: !!landId // Only run if landId exists
    });
};

export const useUpdateLandStatus = () => trpc.land.updateStatus.useMutation();

// --- ADMIN LAND MANAGEMENT HOOKS ---

export const useGetAllLandsAdmin = (filters: {
    status?: 'AVAILABLE' | 'UNVERIFIED' | 'REJECTED' | 'IN_NEGOTIATION' | 'LEASED' | 'HIDDEN';
}) => trpc.land.getAllLandsAdmin.useQuery(filters);

export const useAcceptLand = () => {
    const utils = trpc.useUtils();
    return trpc.land.acceptLand.useMutation({
        onSuccess: () => {
            // Refetch admin lists to show updated status immediately
            utils.land.getAllLandsAdmin.invalidate();
            // Also invalidate search so the public sees the newly available land
            utils.land.search.invalidate();
        }
    });
};

export const useRejectLand = () => {
    const utils = trpc.useUtils();
    return trpc.land.rejectLand.useMutation({
        onSuccess: () => {
            utils.land.getAllLandsAdmin.invalidate();
        }
    });
};

// ============================================================================
// LEASE HOOKS
// ============================================================================
export const useSubmitLeaseApplication = () => trpc.lease.Submitapplication.useMutation();
export const useAcceptLeaseApplication = () => trpc.lease.AcceptApplication.useMutation();
export const useRejectLeaseApplication = () => trpc.lease.RejectApplication.useMutation();

export const useGetApplicationById = (applicationId: string) => {
    return trpc.lease.GetApplicationById.useQuery({ applicationId }, {
        enabled: !!applicationId
    });
};

export const useGetAllApplications = (filters: {
    status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
    landId?: string;
    leaserId?: string;
}) => {
    return trpc.lease.GetAllApplications.useQuery(filters);
};

// ============================================================================
// ESCROW HOOKS
// ============================================================================
export const usePayEscrow = () => trpc.escrow.PayEscrow.useMutation();
export const useVerifyMalpotPapers = () => trpc.escrow.VerifyMalpotPapers.useMutation();

export const useGetMyAcceptedApplications = (filters: {
    landId?: string;
} = {}) => {
    return trpc.lease.GetMyAcceptedApplications.useQuery(filters);
};
//===========================================================================
export const useGetMyEscrows = () => trpc.escrow.GetMyEscrows.useQuery({});
export const useGetMyOwnerEscrows = () => trpc.escrow.GetMyOwnerEscrows.useQuery({});

export const useGetEscrowById = (id: string) => {
  return trpc.escrow.GetEscrowById.useQuery(
    { id },
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};
export const useSubmitMalpotPapers = () => trpc.escrow.SubmitMalpotPapers.useMutation();
// ============================================================================
// ESCROW HOOKS
// ============================================================================

/**
 * Fetches all escrows that require Admin review (Legal papers uploaded)
 * and previously handled escrows (History).
 */
export const useGetAllEscrowsForAdmin = () => {
    return trpc.escrow.GetAllEscrowsForAdmin.useQuery();
};

/**
 * Admin mutation to either RELEASE funds (APPROVE) or reset the 
 * document upload process (REJECT).
 */
export const useVerifyLegalDocuments = () => {
    const utils = trpc.useUtils();
    return trpc.escrow.VerifyLegalDocuments.useMutation({
        onSuccess: () => {
            // Refresh the admin list immediately
            utils.escrow.GetAllEscrowsForAdmin.invalidate();
            // Optional: Invalidate specific escrow if you have a detail view
            utils.escrow.GetEscrowById.invalidate();
        }
    });
};
export const useGetMyLands = (filters?: {
  status?: 'AVAILABLE' | 'UNVERIFIED' | 'REJECTED' | 'IN_NEGOTIATION' | 'LEASED' | 'HIDDEN';
}) => {
  return trpc.land.getMyLands.useQuery(filters ?? {});
};  
export const useGetMyApplications = (filters: {
  status?: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";
} = {}) => {
  return trpc.lease.GetMyApplications.useQuery(filters);
};
export const useGetMyLeaserApplications = (input?: {
  landId?: string;
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}) => {
  return trpc.lease.GetMyLeaserApplications.useQuery(input ?? {}, {
    enabled: true,
  });
};
export const useGetAllAgreementEscrowsForAdmin = () => {
    return trpc.escrow.GetAllEscrowsAgreementForAdmin.useQuery();
};





