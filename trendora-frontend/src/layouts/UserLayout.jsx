import UserAppBar from "../components/user/UserAppBar";

function UserLayout({ children, hideCategoryNavigation = false }) {
  return (
    <>
   <UserAppBar
        hideCategoryNavigation={hideCategoryNavigation}
      />
      {children}
    </>
  );
}

export default UserLayout;