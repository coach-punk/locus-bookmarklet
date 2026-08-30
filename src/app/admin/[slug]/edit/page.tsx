import { notFound } from "next/navigation";
import { getRating } from "@/lib/ratings";
import { RatingForm } from "@/components/RatingForm";

export default async function EditRatingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rating = await getRating(slug);
  if (!rating) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Edit “{rating.title}”</h1>
      <RatingForm
        mode="edit"
        slug={rating.slug}
        initial={{
          tmdbUrl: rating.tmdbUrl,
          rating: rating.rating,
          notes: rating.notes,
          title: rating.title,
        }}
      />
    </div>
  );
}
