"use client";

import { useEffect, useState } from "react";
import { changeStatus, getPassDetails } from "../actions/details";
import { FaCheckCircle, FaUserAlt } from "react-icons/fa";
import {
  MdEmail,
  MdPhone,
  MdOutlinePayments,
  MdCalendarToday,
} from "react-icons/md";
import { FiAlertTriangle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function DetailsPage({ searchParams }: PageProps) {
  const id = searchParams.pass_id as string;
  const [pass, setPass] = useState<any>(null);
  const router = useRouter();

  function entryStatus(index: number) {
    const toastId = toast.loading("Marking participant as entered...");

    changeStatus(pass._id, localStorage.getItem("token") || "", index).then(
      (data) => {
        if (data.status === 200) {
          toast.success("Marked participant as entered successfully!", {
            id: toastId,
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.error("Failed to mark entry. Please try again.", {
            id: toastId,
          });
        }
      }
    );
  }

  useEffect(() => {
    if (id) {
      getPassDetails(id, localStorage.getItem("token") as string).then(
        (data) => {
          if (data.status === 200) {
            setPass(data.pass);
          } else {
            setPass("error");
          }
        }
      );
    }
  }, [id]);

  if (!pass) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <p className="text-[#f9dd9c] text-lg md:text-xl animate-pulse">
          Loading Pass Details...
        </p>
      </div>
    );
  }

  if (pass === "error") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black px-4">
        <div className="bg-[#2b2b2b] shadow-md rounded-lg p-6 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <FiAlertTriangle className="text-red-500 text-4xl" />
          </div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error: Unable to fetch pass details
          </h2>
          <p className="text-[#f9dd9c] mb-4">
            Something went wrong. Please try again later.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-black flex flex-col items-center justify-center">
      <div className="bg-black shadow-xl rounded-xl w-full max-w-3xl p-8 border border-[#f9dd9c]">
        <h1 className="text-3xl font-extrabold text-center text-[#f9dd9c] mb-8">
          Pass Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base text-[#f9dd9c]">
          <div className="flex items-center gap-2">
            <FaUserAlt className="text-[#f9dd9c]" />{" "}
            <span>
              <strong>Name:</strong> {pass.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MdEmail className="text-red-500" />{" "}
            <span>
              <strong>Email:</strong> {pass.email}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MdPhone className="text-green-600" />{" "}
            <span>
              <strong>Phone:</strong> {pass.phone}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <strong>Order ID:</strong> {pass.orderId}
          </div>
          <div className="flex items-center gap-2">
            <MdOutlinePayments className="text-[#f9dd9c]" />{" "}
            <span>
              <strong>Amount:</strong> ₹{pass.amount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <strong>Participants:</strong> {pass.noOfParticipants}
          </div>
          <div className="flex items-center gap-2">
            <MdCalendarToday className="text-[#f9dd9c]" />{" "}
            <span>
              <strong>Created At:</strong>{" "}
              {new Date(pass.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <strong>Class ID:</strong> {pass.classId || "N/A"}
          </div>
        </div>

        <hr className="my-8 border-t border-[#f9dd9c]" />

        <h2 className="text-2xl font-semibold mb-4 text-[#f9dd9c]">
          👥 Participants
        </h2>
        <div className="flex flex-col gap-4">
          {pass.participantsData.map((participant: any, index: number) => {
            const isEntered = participant.arrived;
            return (
              <div
                key={index}
                className="flex justify-between items-center bg-[#333333] p-4 rounded-lg shadow-sm border border-[#f9dd9c]"
              >
                <div className="flex items-center gap-3 font-medium text-[#f9dd9c]">
                  <FaUserAlt />
                  {participant.name}
                </div>
                <button
                  onClick={() => entryStatus(index)}
                  className={`px-5 py-2 rounded-lg text-black font-semibold transition duration-200 ease-in-out ${
                    isEntered
                      ? "bg-green-500 cursor-not-allowed"
                      : "bg-white hover:bg-[#f9e28b] active:scale-95"
                  }`}
                  disabled={isEntered}
                >
                  {isEntered ? (
                    <span className="flex items-center gap-1">
                      <FaCheckCircle className="text-white" />
                      Entered
                    </span>
                  ) : (
                    "Mark Entry"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
