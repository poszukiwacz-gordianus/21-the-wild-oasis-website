## The Wild Oasis Website

Finall project in Jonas Schmedtmann's <a href="https://www.udemy.com/course/the-ultimate-react-course">Ultimate React Course</a>. Built with Next.js.

## My additions to the original project:

1. Added a condition to hide the flag image in UpdateProfileForm if the user hasn't set a flag yet.
2. Fixed a bug in DayPicker that caused an error message when the starting date was re-selected, preventing users from proceeding with their booking.
3. Reduced font size for better readability.
4. Added previous and next cabin navigation on the cabin page to improve user navigation between cabins.
5. Updated error handling: moved most error messages from error.js to notifications, and added success notifications (e.g., "Profile updated successfully").
6. Changed reservation deletion confirmation from confirm("") to a notification-based confirmation.
7. Added an option for users to select breakfast in the reservation form.
8. Updated UpdateReservationForm to allow users to add or remove breakfast.
9. Added current reservation display to ReservationCard.
10. Updated the account page to show users information about their upcoming stay, including check-in time if it's the check-in day, and the number of nights left if the guest is checked in.
11. Disabled days in DayPicker that the guest has already reserved.
12. Added a server-side check to prevent double-booking of cabins before adding a new reservation.

## Deployed on Vercel

<a href="https://the-wild-oasis-website-demo-tau.vercel.app/">Live Demo</a>
