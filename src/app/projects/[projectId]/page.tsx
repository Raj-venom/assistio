

interface Props {
  params: Promise<{ projectId: string }>;
}

async function page({ params }: Props) {
    const { projectId } = await params;

    return (
        <div>
            <h1>Project ID: {projectId}</h1>
        </div>
    );

}

export default page