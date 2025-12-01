import BacklogDetail from '@/components/BacklogDetail';

export default function BacklogItemPage({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <BacklogDetail id={params.id} />
        </div>
    );
}
