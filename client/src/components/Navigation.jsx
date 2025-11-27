import user_img from '../assets/user-img.svg';
import setting_icon from '../assets/setting-icon.svg'
export default function Navigation() {

    return (
        <div className="flex justify-between shadow-lg min-h-16 px-4">
            <div className='flex items-center gap-2'>
                <img className='h-8 w-8' src={user_img} alt="" />
                <span>
                    <p className='font-semibold'>Sample Name</p>
                    <p className='text-xs font-semibold'>Admin</p>
                </span>
            </div>
            <button className='cursor-pointer'>
                <img className='h-6 w-6' src={setting_icon} alt="" />
            </button>
        </div>
    )
}