import add_icon from '../assets/add-icon.svg'
import search from '../assets/search.svg'
import edit_icon from '../assets/edit-icon.svg'
import delete_icon from '../assets/delete-icon.svg'
import view_icon from '../assets/view-icon.svg'

export default function Inventory() {

    return (
        <div className="flex flex-col grow p-4 max-h-[calc(100vh-4rem)]">
            <div className='flex flex-wrap gap-8 items-center'>
                <p className='text-lg font-semibold'>Book Management</p>

                <div className='flex grow flex-wrap gap-4'>
                    <button className='flex items-center gap-2 bg-black text-white p-2 rounded-md text-sm cursor-pointer hover:scale-105 active:scale-95 duration-250'>
                        <img className='h-4' src={add_icon} alt="" />
                        Add Book
                    </button>

                    <div className='flex grow gap-2 border rounded-md min-w-fit'>
                        <button className='cursor-pointer p-2'>
                            <img src={search} alt="" />
                        </button>
                        <input className='grow text-sm outline-none' type="text" placeholder="Search by ID or Type" />
                    </div>
                </div>
            </div>
            <div className='grow border border-gray-300 shadow-lg mt-4 rounded-md overflow-auto'>
                <table className='table-style w-full'>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Name</td>
                            <td>Type</td>
                            <td>Language</td>
                            <td>Availability</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Hibernate Core ~11th</td>
                            <td>educational</td>
                            <td>english</td>
                            <td>available</td>
                            <td>
                                <div className='flex justify-center items-center gap-4'>
                                    <button>
                                        <img src={edit_icon} alt="" />
                                    </button>
                                    <button>
                                        <img src={delete_icon} alt="" />
                                    </button>
                                    <button>
                                        <img src={view_icon} alt="" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}