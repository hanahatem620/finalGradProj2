'use client'
import {Button, Table} from "@heroui/react";

export default function ProviderBookings() {
  return (
    <>
    <div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-4'>
        <div>
            <h2 className='font-bold text-3xl'>Manage Bookings</h2>
            <p className='text-gray-500'>Review and respond to booking request from clients</p>
        </div>

         <div className="pending-booking">
        <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-xl">Pending Bookings</h2>
            <p className="text-pink-500 text-sm font-semibold">3 pending</p>
        </div>

                    <Table className="bg-white">
              <Table.ScrollContainer>
                <Table.Content aria-label="pending" className="min-w-150">
                  <Table.Header className={'bg-pink-500'}>
                    <Table.Column isRowHeader>CLIENT</Table.Column>
                    <Table.Column>SERVICES</Table.Column>
                    <Table.Column>DATE & TIME</Table.Column>
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
                      <Table.Cell>MakeUp</Table.Cell>
                      <Table.Cell>Apr 5, 2026</Table.Cell>
                      <Table.Cell className={"flex gap-1"}>
                        <Button className="bg-pink-500 text-white">Approve</Button>
                <Button className="bg-white text-black border border-gray-200">Reject</Button>
                      </Table.Cell>
                    </Table.Row>
                    
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
        </div>

         <div className="accepted-booking">
        <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-xl">Accepted Bookings</h2>
            <p className="text-pink-500 text-sm font-semibold">Accepted Bookings</p>
        </div>

                    <Table className="bg-white">
              <Table.ScrollContainer>
                <Table.Content aria-label="accepted" className="min-w-150">
                  <Table.Header className={'bg-pink-500'}>
                    <Table.Column isRowHeader>CLIENT</Table.Column>
                    <Table.Column>SERVICES</Table.Column>
                    <Table.Column>DATE & TIME</Table.Column>
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
                      <Table.Cell>CEO</Table.Cell>
                      <Table.Cell>Active</Table.Cell>
                      <Table.Cell className={'flex gap-2'}>
                        <Button className="bg-pink-500 text-white">Message Client</Button>
                </Table.Cell>
                    </Table.Row>
                    
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
        </div>

        <div className="processed-bokking">
            <div>
                <h2 className="font-bold text-xl">Processed Bookings</h2>
            </div>
            <div className="bg-gray-50 p-2 rounded-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <p className="text-pink-500 bg-pink-100 p-2 w-fit rounded-full font-semibold">SW</p>
                    <h3 className="font-semibold">Sarah Wiliams</h3>
                </div>
                <p>Makeup</p>
                <p>Mar 30</p>
                <p className="text-green-500 bg-green-100 p-2 w-fit rounded-md ">Completed</p>
            </div>

        </div>

    </div>
    </>
  )
}
