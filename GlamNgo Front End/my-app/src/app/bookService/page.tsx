'use client'
import { Button } from "@/components/ui/button"
import HomeFooter from "../_components/HomeFooter/homeFooter"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { CiCalendar } from "react-icons/ci"
import { SearchIcon } from "lucide-react"
import { SlLocationPin } from "react-icons/sl"
import Artists from "../artists/page"
import { useState } from "react"
import { AppliedFilters } from "@/types/bookingSearch.type"



export default function BookService() {

  const [serviceType, setServiceType] = useState('')
  const [location,    setLocation]    = useState('')
  const [date,        setDate]        = useState('')
  const [price,       setPrice]       = useState('')
  const [artistName,  setArtistName]  = useState('')


  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    serviceType: '',
    location: '',
    date: '',
    price: '',
    artistName: '',
  })


  function handleSearch() {
    setAppliedFilters({ serviceType, location, date, price, artistName })
  }

  return (
    <>
      <div className="py-15 bg-linear-to-b from-pink-50 to-purple-50">
        <div className="container w-[90%] mx-auto">
          <div className="text-center">
          <h1 className="font-bold text-5xl mb-3">Book a Service</h1>
          <p className="text-gray-500">
            Find and book the perfect makeup and hair artist for your special occasion
          </p>
        </div>

        <div className=" bg-white p-8 mx-auto mt-4 shadow rounded-xl">
          <FieldGroup className="flex lg:flex-row">

            <Field className="w-xs gap-1">
              <FieldLabel>Service Type</FieldLabel>
              <InputGroup className="shadow-none rounded-full">
                <InputGroupInput
                  placeholder="e.g. Bridal Makeup"
                  value={serviceType}
                  onChange={e => setServiceType(e.target.value)}
                  // Allow pressing Enter to trigger search
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <InputGroupAddon align="inline-start">
                  <SearchIcon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field className="w-xs gap-1">
              <FieldLabel>Location</FieldLabel>
              <InputGroup className="shadow-none rounded-full">
                <InputGroupAddon>
                  <InputGroupText><SlLocationPin /></InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Enter your location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </InputGroup>
            </Field>

            <Field className="w-xs gap-1">
              <FieldLabel>Date</FieldLabel>
              <InputGroup className="shadow-none rounded-full">
                <InputGroupAddon>
                  <InputGroupText><CiCalendar /></InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </InputGroup>
            </Field>

            <Field className="w-xs gap-1">
              <FieldLabel>Price Range</FieldLabel>
              <InputGroup className="shadow-none rounded-full">
                <InputGroupAddon>
                  <InputGroupText>EGP</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="e.g. 500"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </InputGroup>
            </Field>

            <Field className="w-xs gap-1">
              <FieldLabel>Artist Name</FieldLabel>
              <InputGroup className="shadow-none rounded-full">
                <InputGroupInput
                  placeholder="Enter artist name"
                  value={artistName}
                  onChange={e => setArtistName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </InputGroup>
            </Field>

          </FieldGroup>

          <div className="mt-5 flex gap-2">
            <Button
              onClick={handleSearch}
              className="bg-linear-to-b from-pink-400 to-pink-500 rounded-full flex-1 cursor-pointer"
            >
              Search Artist
            </Button>

            {(appliedFilters.serviceType || appliedFilters.location ||
              appliedFilters.price || appliedFilters.artistName) && (
              <Button
                variant="outline"
                className="rounded-full border-pink-300 text-pink-500 hover:bg-pink-50"
                onClick={() => {
                  setServiceType(''); setLocation('')
                  setDate('');        setPrice('')
                  setArtistName('')
                  setAppliedFilters({ serviceType: '', location: '', date: '', price: '', artistName: '' })
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
        </div>
      </div>

      <div className="bg-white">
        <Artists appliedFilters={appliedFilters} />
      </div>

      <HomeFooter />
    </>
  )
}