"use client";
import { Button } from "@/components/ui/button";
import { useAdjusterNavigationContext } from "@/context/adjusterNavigation-provider";
import { useInspectionFormContext } from "@/context/inspectionForm-provider";
import React, { useState, useEffect } from "react";
import Inspection from "./Forms/Inspection";
import { FormProvider, useForm } from "react-hook-form";
import { useInspectionDataContext } from "@/context/inspectionData-provider";
import Risk from "./Forms/Risk";
import CauseOfLoss from "./Forms/CauseOfLoss";
import Damages from "./Forms/Damages";
import Pse from "./Forms/Pse";
import Coverage from "./Forms/Coverage";
import OtherTasks from "./Forms/OtherTasks";
import {
    CreateDocument,
    UpdateDocument,
} from "@/cms/DatabaseHelpers/database-helper";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { openDB } from "idb";

const InspectionForm = ({ currentUser }) => {
    const { nextStep, prevStep, step, setStep } = useAdjusterNavigationContext();
    const { claimData, data, loading } = useInspectionDataContext();
    const [isSubmiting, setIsSubmiting] = useState(false);
    const router = useRouter();
    const params = useParams();
    let claimdDataTransformed = {};
    for (let key in claimData) {
        claimdDataTransformed[key] = { oldValue: String(claimData[key]) };
    }

    useEffect(() => {
        const handleOnline = () => {
            const offlineData = localStorage.getItem("offlineFormData");
            if (offlineData) {
                const parsedData = JSON.parse(offlineData);
                fetch('/api/submitInspection', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(parsedData),
                })
                    .then((res) => res.json())
                    .then((res) => {
                        if (res.success) {
                            toast({
                                title: res.message,
                            });
                            router.push("/claims");
                        } else {
                            toast({
                                title: res.message,
                            });
                        }
                        localStorage.removeItem("offlineFormData");
                    })
                    .catch((err) => {
                        console.error("Error", err);
                    });
            }
        };
        if (navigator.onLine) {
            handleOnline()
        }
    }, [router]);
    // console.log(currentUser);
    const handleClearForm = () => {
        // reset(claimdDataTransformed);
        setTimeout(() => {
            reset();
            reset({});
            reset({});
        }, 1000);
        localStorage.removeItem("inspectionForm");
        setStep(1); // Reset to the first step

        toast({
            title: "Form cleared",
            description: "The form has been cleared.",
        });
    };

    const methods = useForm({
        defaultValues: {
            ...claimdDataTransformed,
        },
    });
    const { watch, setValue, reset } = methods;

    useEffect(() => {
        const storedData = localStorage.getItem("inspectionForm");
        if (storedData) {
            reset(JSON.parse(storedData));
        }
    }, [reset]);

    // useEffect(() => {
    //   const subscription = watch((value) => {
    //     localStorage.setItem("inspectionForm", JSON.stringify(value));
    //   });
    //   return () => subscription.unsubscribe();
    // }, [watch]);

    useEffect(() => {
        const subscription = watch((value) => {
            const roomsDamaged = parseInt(value.rooms_damaged?.newValue || value.rooms_damaged?.oldValue, 10) || 1;
            if (value.description_of_damage) {
                value.description_of_damage = value.description_of_damage.slice(0, roomsDamaged);
            }
            localStorage.setItem("inspectionForm", JSON.stringify(value));
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleNextStep = () => {
        nextStep();
        scrollToTop();
    };

    const handlePrevStep = () => {
        prevStep();
        scrollToTop();
    };

    // const onSubmit = async (data) => {
    //   const newData = {};
    //   console.log(data);
    //   // Populate newData with oldValue
    //   for (let key in data) {
    //     newData[key] = { ...data[key], oldValue: claimData[key] !== undefined ? String(claimData[key]) : "" };
    //   }
    //   console.log(newData);

    //   // Transform newData values to arrays
    //   for (let key in newData) {
    //     let { newValue, isCorrect, oldValue } = newData[key];

    //     // If isCorrect is true or null, set newValue to null
    //     if (isCorrect === "Yes" || isCorrect === false || isCorrect === null) {
    //       newValue = "";
    //     }

    //     newData[key] = [
    //       newValue !== undefined ? String(newValue) : "",
    //       isCorrect !== undefined ? String(isCorrect) : "",
    //       oldValue !== undefined ? String(oldValue) : "",
    //     ];
    //   }

    //   // Remove the $id field if it exists
    //   if (newData.$id) {
    //     delete newData.$id;
    //   }

    //   if (navigator.onLine) {
    //     // Generate a custom ID
    //     const customId = params.id;
    //     const res = await CreateDocument(
    //       process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB,
    //       process.env.NEXT_PUBLIC_VNG_INSPECTION,
    //       newData,
    //       customId
    //     );
    //     if (res.success) {
    //       toast({
    //         title: "Inspection Created",
    //       });

    //       try {
    //         const updateRes = await UpdateDocument(
    //           process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB,
    //           process.env.NEXT_PUBLIC_VNG_CLAIMS,
    //           claimData.$id,
    //           { status: "Inspection Completed" }
    //         );
    //         if (updateRes.success) {
    //           localStorage.removeItem("inspectionForm");
    //           router.push("/claims");
    //         }
    //       } catch (error) {
    //         console.log(error.message);
    //       }
    //     } else {
    //       toast({
    //         title: res.message,
    //       });
    //     }
    //   } else {
    //     // User is offline, store data locally
    //     localStorage.setItem("offlineFormData", JSON.stringify(newData));
    //     toast({
    //       title: "Form data saved offline. It will be synced when you go online.",
    //     });
    //   }
    // };

    const queuePostRequest = async (data) => {
        const db = await openDB("post-requests", 1, {
            upgrade(db) {
                db.createObjectStore("requests", { autoIncrement: true });
            },
        });

        await db.put("requests", data);
    };

    const onSubmit = async (formData) => {
        setIsSubmiting(true);
        const newData = {};
        // Populate newData with oldValue
        for (let key in formData) {
            newData[key] = {
                ...formData[key],
                oldValue: claimData[key] !== undefined ? String(claimData[key]) : "",
            };
        }

        // Create a map of field names to their toggle group names
        const toggleGroups = {};
        data.forEach((field) => {
            if (field.ToggleGroup) {
                toggleGroups[field.FieldName] = field.ToggleGroup;
            }
        });

        // Create a map of toggle group values
        const toggleGroupValues = {};
        for (let key in newData) {
            if (toggleGroups[key]) {
                const toggleGroupFieldName = toggleGroups[key];
                if (newData[toggleGroupFieldName]) {
                    toggleGroupValues[toggleGroupFieldName] =
                        newData[toggleGroupFieldName].newValue;
                }
            }
        }

        // Transform newData values to arrays
        for (let key in newData) {
            let { newValue, isCorrect, oldValue } = newData[key];

            // If isCorrect is true or null, set newValue to null
            if (isCorrect === "Yes" || isCorrect === false || isCorrect === null) {
                newValue = "";
            }

            // If the toggle group field value is "No", set the field's newValue to null
            const toggleGroupFieldName = toggleGroups[key];
            if (
                toggleGroupFieldName &&
                toggleGroupValues[toggleGroupFieldName] === "No"
            ) {
                newValue = "";
            }

            newData[key] = [
                newValue !== undefined ? String(newValue) : "",
                isCorrect !== undefined ? String(isCorrect) : "",
                oldValue !== undefined ? String(oldValue) : "",
            ];
        }

        // Remove the $id field if it exists
        if (newData.$id) {
            delete newData.$id;
        }

        if (navigator.onLine) {
            newData.description_of_damage = formData.description_of_damage;
            const onlinedata = {
                customId: params.id,
                requestType: "AdjusterInspectionSubmission",
                newData: newData,
                claimData: claimData,
                currentUser: currentUser.$id
            };
            const response = await fetch('/api/submitInspection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(onlinedata),
            });

            const res = await response.json();
            if (res.success) {
                toast({
                    title: res.message,
                });
                localStorage.removeItem("inspectionForm");
                router.push("/claims");
                setIsSubmiting(false);
            } else {
                toast({
                    title: res.message,
                });
                setIsSubmiting(false);
            }


        } else {
            // User is offline, store data locally
            localStorage.setItem("offlineFormData", JSON.stringify(newData));

            // User is offline, que post request
            const offlineData = {
                customId: params.id,
                requestType: "AdjusterInspectionSubmission",
                newData: newData,
                claimData: claimData,
                currentUser: currentUser.$id
            };


            // await queuePostRequest(offlineData);
            // localStorage.setItem("offlineFormData", JSON.stringify(offlineData));

            // await queuePostRequest(JSON.stringify(offlineData));

            // toast({
            //   title: "Form data saved offline. It will be synced once back online.",
            // });



            fetch('/api/submitInspection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(offlineData),
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log("MESSAGE", res.message);
                    setIsSubmiting(false);
                })
                .catch((err) => {
                    console.error("Error", err);
                    setIsSubmiting(false);
                })
                .finally(() => {
                    console.log("Your request has been successfully submitted.\nOnce you're back online, it will be processed, and you'll receive the result via email.");
                    toast({
                        title: "Form data saved offline. It will be synced once back online.",
                    });
                    localStorage.removeItem("offlineFormData");
                    router.push("/claims");
                    setIsSubmiting(false);
                });
        }
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="max-w-xl w-full px-6 py-8 mx-auto"
            >
                <div>
                    {step === 1 && <Inspection handleClearForm={handleClearForm} />}
                    {step === 2 && <Risk />}
                    {step === 3 && <CauseOfLoss />}
                    {step === 4 && <Damages />}
                    {step === 5 && <Pse />}
                    {step === 6 && <Coverage />}
                    {step === 7 && <OtherTasks />}
                    <div className="flex items-center justify-between py-4">
                        <Button
                            type="button"
                            onClick={handlePrevStep}
                            disabled={step === 1}
                        >
                            Prev
                        </Button>

                        {step !== 7 && (
                            <Button
                                type="button"
                                onClick={handleNextStep}
                                disabled={step === 8}
                            >
                                Next
                            </Button>
                        )}
                        {step === 7 && (
                            <Button type="submit" disabled={isSubmiting || step === 8}>
                                <span className="flex gap-2 justify-center items-center">Submit {isSubmiting && <div className="loader w-7"></div>}</span>
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </FormProvider>
    );
};

export default InspectionForm;
