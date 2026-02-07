import { trpc } from "../lib/trpc";

// ============================================================================
// USER HOOKS
// ============================================================================
export const useGetAllUsers = () => trpc.user.getAllUser.useQuery();
export const useCreateUser = () => trpc.user.createUser.useMutation();
export const useUpgradeRequest = () => trpc.user.upgradeRequest.useMutation();
export const useUpdateKycStatus = () => trpc.user.updateKycStatus.useMutation();
export const useGetKycDetails = () => trpc.user.getKycDetails.useQuery();

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
}) => {
    return trpc.land.search.useQuery(filters);
};

export const useGetLandById = (landId: string) => {
    return trpc.land.getById.useQuery({ landId }, {
        enabled: !!landId // Only run if landId exists
    });
};

export const useUpdateLandStatus = () => trpc.land.updateStatus.useMutation();

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
// Ensure your escrowRouter is defined in your backend for these to work!
export const usePayEscrow = () => trpc.escrow.PayEscrow.useMutation();
export const useVerifyMalpotPapers = () => trpc.escrow.VerifyMalpotPapers.useMutation();