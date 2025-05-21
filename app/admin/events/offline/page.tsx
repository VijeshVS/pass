"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/app/components/Loading";
import { getEventById } from "@/app/actions/events";
import { offlineRegister } from "@/app/actions/details";
import { toast } from "sonner";

export default function EventRegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<boolean>(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [teamsize, setTeamsize] = useState(1);
  const [teamMembers, setTeamMembers] = useState<{ name: string }[]>([
    { name: "" },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting] = useState(false);

  useEffect(() => {
    const event_id = searchParams.get("event_id");

    if (!event_id) {
      setError("No event selected");
      setLoading(false);
      return;
    }

    const loadEvent = async () => {
      try {
        const response = await getEventById(
          event_id,
          localStorage.getItem("token") || ""
        );

        if (response.status != 200) {
          throw new Error("Failed to fetch event");
        }

        const eventData = response.event;
        if (!eventData) {
          setError("Event not found");
          setLoading(false);
          return;
        }

        // Check if registration is open
        // @ts-ignore
        setRegistrationStatus(eventData.registrationOpen);
        setEvent(eventData);

        // Parse min and max team sizes from the string (e.g., "2-4")
        // @ts-ignore
        const sizeRange = eventData.teamsize.split("-");
        const minSize = parseInt(sizeRange[0]) || 1;
        // Initialize with minimum required team size
        setTeamsize(minSize);

        // Create team members array of the correct size
        const initialMembers = Array(minSize)
          .fill(null)
          .map((_, i) => ({
            name: i === 0 ? name : "", // First member is the team leader
          }));

        setTeamMembers(initialMembers);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to load event");
        setLoading(false);
      }
    };

    loadEvent();
  }, [searchParams, name]);

  const handleTeamMemberChange = (index: number, value: string) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers[index] = { name: value };
    setTeamMembers(newTeamMembers);
  };

  const handleTeamsizeChange = (size: number) => {
    if (!event) return;

    // Parse min and max team sizes from the string
    const sizeRange = event.teamsize.split("-");
    const minSize = parseInt(sizeRange[0]) || 1;
    const maxSize = parseInt(sizeRange[1] || sizeRange[0]) || 1;

    // Ensure team size is within allowed range
    const newSize = Math.max(minSize, Math.min(size, maxSize));
    setTeamsize(newSize);

    // Update team members array
    if (newSize > teamMembers.length) {
      // Add new empty members
      setTeamMembers([
        ...teamMembers,
        ...Array(newSize - teamMembers.length)
          .fill(null)
          .map(() => ({ name: "" })),
      ]);
    } else if (newSize < teamMembers.length) {
      // Remove excess members but keep at least the minimum required
      setTeamMembers(teamMembers.slice(0, Math.max(minSize, newSize)));
    }
  };

  // Calculate total registration fee based on feetype
  const calculateTotalFee = () => {
    if (!event) return 0;

    const baseFee = event.registrationFee || 0;

    // If fee type is per team, return base fee regardless of team size
    if (event.feetype === "team") {
      return baseFee;
    }

    // If fee type is per individual, multiply by team size
    return baseFee * teamsize;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !registrationStatus) return;

    const emptyMembers = teamMembers.filter((member) => !member.name.trim());

    if (emptyMembers.length > 0) {
      setError("Please fill in all team member names");
      return;
    }

    const formattedTeamMembers = teamMembers.map((member) => ({
      name: member.name.trim(),
    }));
    const totalFee = calculateTotalFee();

    const registrationPromise = offlineRegister({
      name,
      email,
      phone,
      amount: totalFee,
      classId: event._id,
      noOfParticipants: teamsize,
      participantsData: formattedTeamMembers,
      token: localStorage.getItem("token") || "",
    });

    toast.promise(registrationPromise, {
      loading: "Processing registration...",
      success: () => {
        setTimeout(() => {
          router.refresh();
        }, 3000);
        return "Registration created successfully !!";
      },
      error: (err) => {
        setError(err.message || "Failed to process registration");
        console.error(err);
        return "Failed to create registration";
      },
    });
  };

  if (loading) return <Loading />;
  if (error)
    return <div className="p-8 text-center text-red-500 pt-10">{error}</div>;
  if (!event) return <div className="p-8 text-center">Event not found</div>;

  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-10 px-6">
      <div className="text-3xl font-bold mb-8 text-center text-[#f9dd9c]">
        Offline Register for {event.name}
      </div>

      {!registrationStatus ? (
        <div className="max-w-md mx-auto p-6 bg-red-950 border border-red-500 rounded-lg text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">
            Registration Closed
          </h2>
          <button
            onClick={() => router.push("/events")}
            className="mt-4 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Events
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto space-y-6 border border-gray-700 p-6 rounded-lg bg-gray-950 shadow-lg"
        >
          {/* Name */}
          <div className="space-y-2">
            <label className="block font-medium text-white">
              Full Name<span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-black border border-gray-700 rounded text-white"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block font-medium text-white">
              Email<span className="text-red-500"> *</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-black border border-gray-700 rounded text-white"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block font-medium text-white">
              Phone<span className="text-red-500"> *</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 bg-black border border-gray-700 rounded text-white"
              required
            />
          </div>

          {/* Team Size */}
          {event.teamsize !== "1" && (
            <div className="space-y-2">
              <label className="block font-medium text-white">
                Team Size<span className="text-red-500"> *</span>
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => handleTeamsizeChange(teamsize - 1)}
                  className="w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-700"
                >
                  -
                </button>
                <span className="text-lg font-bold text-[#f9dd9c]">
                  {teamsize}
                </span>
                <button
                  type="button"
                  onClick={() => handleTeamsizeChange(teamsize + 1)}
                  className="w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-700"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-400">
                Allowed team size: {event.teamsize}
              </p>
            </div>
          )}

          {/* Team Members */}
          {teamsize > 1 && (
            <div className="space-y-4">
              <p className="font-bold text-[#f9dd9c]">Team Members</p>
              {teamMembers.map((member, index) => (
                <div key={index} className="space-y-2">
                  <label className="block font-medium text-white">
                    {index === 0 ? "Team Leader" : `Member ${index + 1}`}
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    value={index === 0 ? name : member.name}
                    onChange={(e) =>
                      index === 0
                        ? setName(e.target.value)
                        : handleTeamMemberChange(index, e.target.value)
                    }
                    className="w-full p-2 bg-black border border-gray-700 rounded text-white"
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {/* Fee Display */}
          <div className="border border-gray-700 p-4 rounded bg-black">
            <p className="font-bold mb-2 text-[#f9dd9c]">Registration Fee</p>
            <p className="text-lg text-white">
              ₹{event.registrationFee}{" "}
              {event.feetype === "individuals" ? "per person" : "per team"}
            </p>

            {event.teamsize !== "1" && event.feetype === "individuals" && (
              <p className="text-sm text-gray-400 mt-1">
                Total: ₹{calculateTotalFee()}
              </p>
            )}

            {/* {event.registrationDeadline && (
              <p className="mt-4 text-sm text-white">
                <span className="font-medium">Registration Deadline:</span>{' '}
                {new Date(event.registrationDeadline).toLocaleDateString()} at{' '}
                {new Date(event.registrationDeadline).toLocaleTimeString()}
              </p>
            )} */}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 transition-all"
          >
            {isProcessing ? "Processing..." : "Register"}
          </button>
          <div className="flex-col border-[1px] border-gray-600 justify-center items-center p-2">
            <div className="flex-row justify-center items-center text-gray-600 font-semibold gap-2">
              <span className="text-gray-400">Note</span>
            </div>
            <div className="text-gray-500 text-xs">
              It is advised to take a screenshot of the payment page and save it
              for future reference. If you find difficulties in finding the
              email, then check the spam folder as well.
            </div>
          </div>
        </form>
      )}

      {/* Add loading overlay */}
      {(isProcessing || isRedirecting) && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-[#0a0a0a] p-6 rounded-lg shadow-lg text-center max-w-md border border-gray-700">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-300 mx-auto mb-4"></div>
            <p className="text-xl text-[#f9dd9c] font-bold mb-2">
              {isRedirecting
                ? "Completing Registration..."
                : "Processing Payment..."}
            </p>
            <p className="text-gray-300">
              {isRedirecting
                ? "Please wait while we verify your payment and finalize your registration."
                : "Please complete the payment in the popup window."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
