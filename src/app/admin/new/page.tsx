import { RatingForm } from "@/components/RatingForm";

export default async function NewRatingPage({
  searchParams,
}: {
  searchParams: Promise<{ link?: string; popup?: string }>;
}) {
  const { link, popup } = await searchParams;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Add a rating</h1>
      <RatingForm mode="create" initialLink={link} popup={popup === "1"} />
    </div>
  );
}
