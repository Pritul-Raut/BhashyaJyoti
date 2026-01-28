import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchStudentViewTestSeriesService } from "@/services/test-service"; // We will create this service next
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

function StudentTestSeriesPage() {
    const navigate = useNavigate();
    const [testSeriesList, setTestSeriesList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTests() {
            // Fetch all published test series
            const response = await fetchStudentViewTestSeriesService();
            if (response?.success) {
                setTestSeriesList(response.data);
            }
            setLoading(false);
        }
        fetchTests();
    }, []);

    if (loading) return <div className="p-10"><Skeleton className="w-full h-[300px]" /></div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Explore Test Series</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {testSeriesList && testSeriesList.length > 0 ? (
                    testSeriesList.map((series) => (
                        <Card key={series._id} className="hover:shadow-lg transition-shadow flex flex-col">
                            <CardHeader className="p-0">
                                <img
                                    src={series.image || "/placeholder.jpg"}
                                    alt={series.title}
                                    className="w-full h-48 object-cover rounded-t-xl"
                                />
                            </CardHeader>
                            <CardContent className="p-4 flex-grow">
                                <CardTitle className="text-xl mb-2">{series.title}</CardTitle>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                    {series.description}
                                </p>
                                <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                                    <span>{series.tests?.length || 0} Tests</span>
                                    <span className="text-blue-600">₹{series.price}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Button
                                    className="w-full"
                                    onClick={() => navigate(`/test-series/details/${series._id}`)}
                                >
                                    View Details
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-500">No Test Series Available.</p>
                )}
            </div>
        </div>
    );
}

export default StudentTestSeriesPage;