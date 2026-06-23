import { AdminTripRequestReviewClient } from "./review-action-client";

type PageProps = {
  params: Promise<{
    requestId: string;
  }>;
};

export default async function AdminTripRequestDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const requestId = resolvedParams.requestId;

  return <AdminTripRequestReviewClient requestId={requestId} />;
}