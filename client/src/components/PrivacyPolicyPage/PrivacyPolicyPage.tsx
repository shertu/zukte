import { Typography } from "antd";
import * as React from "react";
import { AppPage } from "../AppPage/AppPage";

const { Paragraph, Text, Title } = Typography;

/**
 * This page outlines the rights of the user in regards to their online privacy while using this web application.
 *
 * @return {JSX.Element}
 */
export function PrivacyPolicyPage(): JSX.Element {
  return (
    <AppPage>
      <Typography>
        <Title level={1}>
          Privacy Policy for {window.location.hostname.toUpperCase()}
        </Title>

        <Paragraph>
          This Privacy Policy document outlines how information about{" "}
          <Text strong>you</Text> is collected and used whilst you visit this
          website.
        </Paragraph>

        <Paragraph>
          Further use of this website is to be considered{" "}
          <Text strong>consent</Text> to our Privacy Policy and agreemnent to
          its terms.
        </Paragraph>

        <Title level={2}>How we collect and use your information</Title>

        <Paragraph>
          This website will not store personal information such as your name,
          email address, phone number, etc.
        </Paragraph>

        <Paragraph>
          This website will use https://www.googleapis.com/auth/userinfo.profile
          to read the name of your Google profile.
        </Paragraph>

        <Title level={2}>Cookies</Title>

        <Paragraph>
          This website, like many other websites, uses computer cookies to help
          keep track of your preferences, authenticaiton session, etc.
        </Paragraph>
      </Typography>
    </AppPage>
  );
}
