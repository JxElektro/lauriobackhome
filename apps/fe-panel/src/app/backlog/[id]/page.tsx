import BacklogDetail from '@/components/BacklogDetail';

export default function BacklogItemPage({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen pb-12 px-4 pt-8 sm:px-6 lg:px-8">
            <BacklogDetail id={params.id} />
        </div>
    );
}
