import { Link } from "react-router-dom";
function ManageMyBooking() {
      return (
            <Link
                  to="/booking"
                  className="px-5 py-2 rounded-full border border-amber-300 text-amber-300 hover:bg-amber-300 hover:text-black transition-all duration-300"
            >
                  Manage my booking
            </Link>
      );
}

export default ManageMyBooking;