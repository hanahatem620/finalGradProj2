'use client'
import { Controller, useForm } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircleIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { artistSchema, artistSchemaType } from "@/schema/artist.shcema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { toast } from "sonner"

// ─── Constants ────────────────────────────────────────────────────────────────

const SPECIALTIES = [
  "Bridal Makeup",
  "Special Events",
  "Natural Makeup",
  "Glam Makeup",
  "Hair Styling",
  "Bridal Hair",
  "Editorial",
  "Airbrush Makeup",
]

const SERVICES = [
  "On-site Services",
  "In-studio Services",
  "Group Bookings",
  "Makeup Lessons",
  "Hair Treatments",
  "Consultation",
]

const STEP_LABELS = [
  "Personal Info",
  "Professional",
  "Services",
  "Portfolio",
  "Verification",
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function ArtistApp() {
  const [step, setStep] = useState(1)

  const form = useForm<artistSchemaType>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      yearsOfExperience: 0,
      specialties: [],
      certifications: "",
      license: "",
      services: [],
      priceRange: 0,
      travelRange: 0,
      portfolioDescription: "",
      instagram: "",
      website: "",
      idCard: undefined,
    },
    // resolver: zodResolver(artistSchema),
  })

  const { handleSubmit, control } = form

  // ── Submit ──────────────────────────────────────────────────────────────────

async function handleArtistLogin(values: artistSchemaType) {
  try {
    const res = await axios.post("http://127.0.0.1:5001/artist/verification", values)
    console.log(res)
    console.log(values)
    if (res.status === 200) {
      toast.success("Application submitted successfully!", {
        duration: 3000,
        position: "top-center",
      })
    }
  } catch (err: any) {
    toast.error(err?.response?.data?.message ?? "Something went wrong. Please try again.", {
      duration: 3000,
      position: "top-center",
    })
  }
}

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function goNext() {
    setStep((s) => s + 1)
  }

  function goPrev() {
    setStep((s) => s - 1)
  }
  
  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Progress Bar ──────────────────────────────────────────────────── */}
      <div className="bg-purple-50 border-b border-purple-200 py-10">
        <div className="container w-[90%] max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((s, i, arr) => (
              <div
                key={s}
                className="flex flex-col items-center flex-1 relative"
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold
                    ${
                      step >= s
                        ? "bg-linear-to-t from-pink-500 to-purple-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {step > s ? <i className="fa-solid fa-check" /> : s}
                </div>

                <p
                  className={`mt-2 text-sm ${
                    step >= s ? "text-gray-700 font-medium" : "text-gray-500"
                  }`}
                >
                  {STEP_LABELS[s - 1]}
                </p>

                {/* Connector line */}
                {i < arr.length - 1 && (
                  <div
                    className={`absolute top-5 lg:-right-24 lg:w-[63%] -right-8 w-[40%] h-1 -z-10
                      ${
                        step > s
                          ? "bg-linear-to-l from-pink-500 to-purple-500"
                          : "bg-gray-300"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form Body ─────────────────────────────────────────────────────── */}
      <div className="bg-white py-10">
        <div className="container w-[90%] max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(handleArtistLogin)}>

            {/* ── Step 1: Personal Info ──────────────────────────────────── */}
            {step === 1 && (
              <div>
                <h1 className="text-3xl font-bold mb-1">Personal Information</h1>
                <p className="text-gray-500">Tell us a bit about yourself.</p>

                <div className="mt-10 flex flex-col gap-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <FieldGroup className="flex-1">
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>First Name *</FieldLabel>
                            <Input
                              {...field}
                              autoComplete="given-name"
                              type="text"
                              placeholder="First Name"
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </FieldGroup>

                    <FieldGroup className="flex-1">
                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Last Name *</FieldLabel>
                            <Input
                              {...field}
                              autoComplete="family-name"
                              type="text"
                              placeholder="Last Name"
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </FieldGroup>
                  </div>

                  <FieldGroup>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Email Address *</FieldLabel>
                          <Input
                            {...field}
                            autoComplete="email"
                            type="email"
                            placeholder="your.email@example.com"
                          />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Phone Number *</FieldLabel>
                          <Input
                            {...field}
                            autoComplete="tel"
                            type="tel"
                            placeholder="(123) 456-7890"
                          />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  <div className="flex justify-end">
                    {/* FIX: type="button" prevents triggering form submission */}
                    <Button
                      type="button"
                      onClick={goNext}
                      className="bg-linear-to-b from-purple-500 to-pink-500 text-white cursor-pointer"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Professional ──────────────────────────────────── */}
            {step === 2 && (
              <div>
                {/* FIX: was incorrectly labelled "Personal Information" */}
                <h1 className="text-3xl font-bold mb-1">
                  Professional Information
                </h1>
                <p className="text-gray-500">
                  Share your expertise and qualifications.
                </p>

                <div className="mt-10 flex flex-col gap-4">
                  <FieldGroup>
                    <Controller
                      name="yearsOfExperience"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Years of Experience *</FieldLabel>
                          <Input
                            type="number"
                            placeholder="Years of Experience"
                            // FIX: coerce string → number for number inputs
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  {/* FIX: specialties checkboxes properly wired to react-hook-form */}
                  <div>
                    <FieldLabel className="text-gray-700 mb-2 block">
                      Specialties * (Select all that apply)
                    </FieldLabel>
                    <Controller
                      name="specialties"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex flex-wrap gap-2">
                            {SPECIALTIES.map((specialty) => (
                              <label
                                key={specialty}
                                className="flex items-center gap-2 border border-gray-200 px-4 py-3 rounded-md cursor-pointer"
                              >
                                <Checkbox
                                  id={specialty}
                                  checked={field.value?.includes(specialty)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value ?? []
                                    field.onChange(
                                      checked
                                        ? [...current, specialty]
                                        : current.filter((v) => v !== specialty)
                                    )
                                  }}
                                />
                                <Label htmlFor={specialty}>{specialty}</Label>
                              </label>
                            ))}
                          </div>
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <FieldGroup>
                    <Controller
                      name="certifications"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Certifications & Training</FieldLabel>
                          <Textarea
                            {...field}
                            placeholder="List your certifications, training programs, and qualifications..."
                          />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <Controller
                      name="license"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>
                            Business License Number (if applicable)
                          </FieldLabel>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter business license number"
                          />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={goPrev}
                      className="bg-white border border-gray-200 text-black hover:bg-gray-50 cursor-pointer"
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={goNext}
                      className="bg-linear-to-b from-purple-500 to-pink-500 text-white cursor-pointer"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Services & Pricing ────────────────────────────── */}
            {step === 3 && (
              <div>
                <h1 className="text-3xl font-bold mb-1">Services & Pricing</h1>
                <p className="text-gray-500">
                  Define what you offer and your rates.
                </p>

                <div className="mt-10 flex flex-col gap-4">
                  {/* FIX: services checkboxes properly wired to react-hook-form */}
                  <div>
                    <FieldLabel className="text-gray-700 mb-2 block">
                      Services Offered * (Select all that apply)
                    </FieldLabel>
                    <Controller
                      name="services"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex flex-wrap gap-2">
                            {SERVICES.map((service) => (
                              <label
                                key={service}
                                className="flex items-center gap-2 border border-gray-200 px-4 py-3 rounded-md cursor-pointer"
                              >
                                <Checkbox
                                  id={service}
                                  checked={field.value?.includes(service)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value ?? []
                                    field.onChange(
                                      checked
                                        ? [...current, service]
                                        : current.filter((v) => v !== service)
                                    )
                                  }}
                                />
                                <Label htmlFor={service}>{service}</Label>
                              </label>
                            ))}
                          </div>
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <FieldGroup>
                    <Controller
                      name="priceRange"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Starting Price Range ($) *</FieldLabel>
                          {/* FIX: coerce string → number */}
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                            onBlur={field.onBlur}
                            name={field.name}
                            placeholder="0"
                          />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <Controller
                      name="travelRange"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Travel Range (miles) *</FieldLabel>
                          {/* FIX: coerce string → number */}
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                            onBlur={field.onBlur}
                            name={field.name}
                            placeholder="0"
                          />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={goPrev}
                      className="bg-white border border-gray-200 text-black hover:bg-gray-50 cursor-pointer"
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={goNext}
                      className="bg-linear-to-b from-purple-500 to-pink-500 text-white cursor-pointer"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 4: Portfolio & Social ────────────────────────────── */}
            {step === 4 && (
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  Portfolio & Social Media
                </h1>
                <p className="text-gray-500">
                  Showcase your work and online presence.
                </p>

                <div className="mt-10 flex flex-col gap-4">
                  <FieldGroup>
                    <Controller
                      name="portfolioDescription"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Portfolio Description *</FieldLabel>
                          <Textarea
                            {...field}
                            placeholder="Describe your style, approach, and what makes you unique..."
                          />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  {/* Portfolio image upload (uncontrolled — wire separately if needed) */}
                  <div>
                    <FieldLabel className="text-sm text-gray-700 mb-2 block">
                      Upload Portfolio Images * (Minimum 5 images)
                    </FieldLabel>
                    <label className="flex flex-col items-center justify-center w-full h-40 border border-dashed border-gray-400 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <svg
                        className="w-10 h-10 text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16"
                        />
                      </svg>
                      <p className="text-sm font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG up to 10MB each
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf"
                        multiple
                      />
                    </label>
                  </div>

                  {/* FIX: {...field} was missing from the Instagram Input */}
                  <FieldGroup>
                    <Controller
                      name="instagram"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Instagram Handle</FieldLabel>
                          <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                              <i className="fa-solid fa-at text-gray-400" />
                            </span>
                            <Input
                              {...field}
                              type="text"
                              className="rounded-none rounded-r-md"
                              placeholder="YourUsername"
                            />
                          </div>
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <Controller
                      name="website"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Website (optional)</FieldLabel>
                          <Input
                            {...field}
                            type="url"
                            placeholder="https://yourwebsite.com"
                          />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={goPrev}
                      className="bg-white border border-gray-200 text-black hover:bg-gray-50 cursor-pointer"
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={goNext}
                      className="bg-linear-to-b from-purple-500 to-pink-500 text-white cursor-pointer"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 5: Identity Verification ────────────────────────── */}
            {step === 5 && (
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  Identity Verification
                </h1>

                <Alert className="mt-4 py-6 bg-amber-50 border-amber-200">
                  <AlertCircleIcon className="text-amber-400" />
                  <AlertTitle className="text-amber-800 font-bold text-lg">
                    Why do we need this?
                  </AlertTitle>
                  <AlertDescription className="text-amber-700">
                    To ensure the safety of our community, all makeup artists
                    must verify their identity by submitting a valid personal ID
                    card. Our admin team will review and approve your account.
                  </AlertDescription>
                </Alert>

                <div className="mt-10 flex flex-col gap-4">
                  <div>
                    <FieldLabel className="text-sm text-gray-700 mb-2 block">
                      Send Personal ID Card{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <label className="flex flex-col items-center justify-center w-full h-52 border border-dashed border-gray-400 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <svg
                        className="w-10 h-10 text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16"
                        />
                      </svg>
                      <p className="text-sm font-medium">Upload your ID card</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Accepted formats: JPG, PNG, PDF (Max 10MB)
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      Your ID information will be kept confidential and used
                      only for verification purposes.
                    </p>
                  </div>

                  <Alert className="bg-purple-50 border-purple-200 p-5">
                    <AlertDescription className="text-gray-800 text-sm">
                      I agree to the{" "}
                      <span className="text-purple-600 font-medium cursor-pointer">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="text-purple-600 font-medium cursor-pointer">
                        Privacy Policy
                      </span>
                      . I confirm that all information provided is accurate and
                      that I have the necessary certifications and licenses to
                      provide beauty services.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={goPrev}
                      className="bg-white border border-gray-200 text-black hover:bg-gray-50 cursor-pointer"
                    >
                      Previous
                    </Button>
                    {/* FIX: final step uses type="submit" to actually submit the form */}
                    <Button
                      type="submit"
                      className="bg-linear-to-b from-purple-500 to-pink-500 text-white cursor-pointer"
                    >
                      Submit Application
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  )
}