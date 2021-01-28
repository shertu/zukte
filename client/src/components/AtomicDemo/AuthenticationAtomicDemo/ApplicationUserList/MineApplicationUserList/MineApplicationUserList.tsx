// import { message, Typography } from 'antd';
// import * as React from 'react';
// import {
//   ApplicationUser, ApplicationUsersApi,
// } from '../../../openapi-generator';
// import { AppPage } from '../../AppPage/AppPage';
// import { ApplicationUserList, filterApplicationUserListWithList } from './ApplicationUserList/ApplicationUserList';
// import { GoogleSignInButton } from './GoogleSignInButton/GoogleSignInButton';
// import { SignOutButton } from './SignOutButton/SignOutButton';

// const { Paragraph } = Typography;

// const APPLICATION_USERS_API: ApplicationUsersApi = new ApplicationUsersApi();

// /**
//  * A demonstration where the user can sign in to the application.
//  *
//  * @return {JSX.Element}
//  */
// export function MineApplicationUserList(): JSX.Element {
//   const [
//     mineApplicationUsers,
//     setMineApplicationUsers,
//   ] = React.useState<ApplicationUser[]>([]);

//   /** The initial data fetch. */
//   React.useEffect(() => {
//     onLoadMineApplicationUser();
//   }, []);

//   /** Fetches the user's application user account from the server. */
//   function onLoadMineApplicationUser(): void {
//     APPLICATION_USERS_API.applicationUsersGetApplicationUsers({
//       mine: true,
//     })
//       .then((res) => setMineApplicationUsers(res.items))
//       .catch((err: Response) => {
//         if (err.status != 401) {
//           message.error(
//             'An unexpected error occured while trying to load your account.',
//           );
//         }
//       });
//   }

//   /** Deletes the user's application user account from the server. */
//   function onDeleteMineApplicationUser(): void {
//     APPLICATION_USERS_API.applicationUsersDeleteApplicationUser({
//       mine: true,
//     })
//       .then((res) => {
//         const newMineApplicationUsers: ApplicationUser[] = filterApplicationUserListWithList(
//           mineApplicationUsers,
//           res.items,
//         );

//         setMineApplicationUsers(newMineApplicationUsers);
//       })
//       .catch((err: Response) =>
//         message.error(
//           'An unexpected error occured while trying to delete your account.',
//         ),
//       );
//   }

//   return (
//     <AppPage pageTitle="Authentication Demo">
//       <div>
//         <Typography className="max-cell-xs">
//           <Paragraph>
//             To use this demo service please sign in to Google and authorize this
//             application to access your Google profile. The application will
//             automatically create an account from the info in your Google
//             profile. You can delete this account at anytime; this will not
//             affect your Google profile.
//           </Paragraph>
//         </Typography>

//         {mineApplicationUsers && <SignOutButton />}

//         {!mineApplicationUsers && <GoogleSignInButton />}
//       </div>

//       <AppPage pageTitle="Accounts">
//         <ApplicationUserList

//         />
//       </AppPage>
//     </AppPage>
//   );
// }
