'use client'
import { BiDollar } from "react-icons/bi";
import { RiGroupLine } from "react-icons/ri";
import { CiCalendar } from "react-icons/ci";
import {Table} from "@heroui/react";
import { Button } from "@/components/ui/button";



export default function ProviderDashboard() {


  
  return (
   <>
    <div className="container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-7">

    <div>
        <h2 className='text-3xl'>Hello, <span className='font-bold'>sarah</span></h2>
        <p className='text-pink-500'>Here's what's happening today in your business</p>
    </div>

    <div className="flex gap-4">

    <div className='shadow-md rounded-md p-4 w-fit'>
            <div className="bg-pink-100 p-2 rounded-md w-fit">
                <CiCalendar className="text-pink-500 text-2xl"/>
            </div>

            <p className="text-gray-500">Pending Bookings</p>
            <h2 className="font-bold">3</h2>
    </div>

    <div className='shadow-md rounded-md p-4 w-fit'>
            <div className="bg-pink-100 p-2 rounded-md w-fit">
                <RiGroupLine className="text-pink-500 text-2xl"/>
            </div>

            <p className="text-gray-500">Accepted Bookings</p>
            <h2 className="font-bold">1</h2>
    </div>

    <div className='shadow-md rounded-md p-4 w-fit'>
            <div className="bg-pink-100 p-2 rounded-md w-fit">
                <BiDollar className="text-pink-500 text-2xl"/>
            </div>

            <p className="text-gray-500">Available Days</p>
            <h2 className="font-bold">5</h2>
    </div>


    </div>

    <div className="shadow-md rounded-md p-5">
        <h2 className="font-bold mb-3">Pending Artist Approvals</h2>

        <div>
    <Table className="bg-white">
      <Table.ScrollContainer>
        <Table.Content aria-label="Team members" className="min-w-150">
          <Table.Header className={'bg-pink-500'}>
            <Table.Column isRowHeader>CLIENT</Table.Column>
            <Table.Column>SERVICES</Table.Column>
            <Table.Column>DATE</Table.Column>
            <Table.Column>STATUS</Table.Column>
            <Table.Column>ACTION</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell className={'flex items-center gap-2'}>
                <div>
                    <p className="text-pink-500 bg-pink-100 p-2 w-fit rounded-full font-semibold">SJ</p>
                </div>
                <div>
                    <h2 className="font-bold">Sarah jenkis</h2>
                    <p className="text-gray-500 text-xs">Applied 2 hours ago</p>
                </div>
              </Table.Cell>
              <Table.Cell>Bridal Makeup</Table.Cell>
              <Table.Cell>Apr. 2, 2026</Table.Cell>
              <Table.Cell>Pending</Table.Cell>
              <Table.Cell>
                <Button className="bg-pink-100 text-pink-500">Approve</Button>
                <Button className="bg-white text-black border border-gray-200">Reject</Button>
              </Table.Cell>
            </Table.Row>
            
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
        </div>

    </div>

    <div className="shadow-md rounded-md border border-gray-200 p-5">
        <div>
            <h2 className="font-bold mb-3">LATEST REVIEW ABOUT YOUR WORK</h2>
        </div>

        <div className="flex  items-center gap-2">
            <div>
                <p className="text-pink-500 bg-pink-100 p-2 w-fit rounded-full font-bold">HH</p>
            </div>
            <div>
                <h2>Hana Hatem</h2>
                <p className="font-semibold">Absolutely stunning! Everyone was complimenting.</p>
            </div>
        </div>


    </div>


        </div>   
   </>
  )
}
