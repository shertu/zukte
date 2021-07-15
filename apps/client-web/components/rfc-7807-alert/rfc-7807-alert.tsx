// import React from 'react';

// export interface Rfc7807Props {
//   type?: string;
//   title?: string;
//   status?: number;
//   detail?: string;
//   instance?: string;
//   onClickRetry?: React.MouseEventHandler<HTMLElement>;
// }

// /**
//  * A error message component which implements
//  * the https://tools.ietf.org/html/rfc7807 standard.
//  */
// export function Rfc7807Alert(props: Rfc7807Props) {
//   const {
//     type = 'about:blank',
//     title = 'HTTP API error',
//     status,
//     detail,
//     instance,
//     onClickRetry,
//   } = props;

//   const [showDetails, setShowDetails] = React.useState<boolean>(false);

//   return null;

//   return (
//     <Alert
//       message={title}
//       type="error"
//       action={
//         <Space>
//           {!showDetails && (
//             <Button size="small" onClick={() => setShowDetails(true)}>
//               details
//             </Button>
//           )}
//           {onClickRetry && (
//             <Button size="small" danger onClick={onClickRetry}>
//               retry
//             </Button>
//           )}
//         </Space>
//       }
//       description={
//         showDetails && (
//           <Descriptions title="Error Information">
//             <Descriptions.Item label="Problem Classification">
//               {type}
//             </Descriptions.Item>
//             <Descriptions.Item label="Detail">{detail}</Descriptions.Item>
//             <Descriptions.Item label="HTTP Status Code">
//               {status}
//             </Descriptions.Item>
//             <Descriptions.Item label="Trace Instance">
//               {instance}
//             </Descriptions.Item>
//           </Descriptions>
//         )
//       }
//     />
//   );
// }
