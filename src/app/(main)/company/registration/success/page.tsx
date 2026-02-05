"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, Home } from "lucide-react";

export default function RegistrationSuccessPage() {
    const router = useRouter();
    const [smiName, setSmiName] = useState("");
    const [userName, setUserName] = useState("");

    useEffect(() => {
        // Get user info from localStorage
        const storedSmiName = localStorage.getItem("smiName") || "your institution";
        const storedUserName = localStorage.getItem("userName") || "";
        setSmiName(storedSmiName);
        setUserName(storedUserName);
    }, []);

    const handleViewDashboard = () => {
        router.push("/");
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
            <Card className="w-full max-w-2xl shadow-xl">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-green-100 p-4">
                            <CheckCircle2 className="h-16 w-16 text-green-600" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900">
                        Registration Submitted Successfully!
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-semibold text-lg text-blue-900 mb-2">
                            What happens next?
                        </h3>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="inline-block w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                    1
                                </span>
                                <span>
                                    Your offsite profiling data for <strong>{smiName}</strong> has been successfully submitted to SECZIM.
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-block w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                    2
                                </span>
                                <span>
                                    Our regulatory team will review your submission within 5-7 business days.
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-block w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                    3
                                </span>
                                <span>
                                    You will receive an email notification once the review is complete.
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-block w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                    4
                                </span>
                                <span>
                                    If additional information is required, we will contact you at the email address provided.
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800">
                            <strong>Important:</strong> Please keep a copy of your submission for your records.
                            You can access your dashboard to view the status of your application.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            onClick={handleViewDashboard}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            size="lg"
                        >
                            <Home className="mr-2 h-5 w-5" />
                            Go to Dashboard
                        </Button>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="flex-1"
                            size="lg"
                        >
                            <FileText className="mr-2 h-5 w-5" />
                            Logout
                        </Button>
                    </div>

                    <div className="text-center text-sm text-gray-500 pt-4 border-t">
                        <p>
                            For assistance, contact SECZIM at{" "}
                            <a href="mailto:support@seczim.gov.zw" className="text-blue-600 hover:underline">
                                support@seczim.gov.zw
                            </a>{" "}
                            or call{" "}
                            <a href="tel:+263242369000" className="text-blue-600 hover:underline">
                                +263 242 369 000
                            </a>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
