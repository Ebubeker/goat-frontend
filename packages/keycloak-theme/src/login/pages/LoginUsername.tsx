import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { clsx } from "keycloakify/tools/clsx";
import { useConstCallback } from "keycloakify/tools/useConstCallback";
import type { FormEventHandler } from "react";
import { useState } from "react";

import type { I18n } from "../i18n";
import type { KcContext } from "../kcContext";

export default function LoginUsername(
  props: PageProps<Extract<KcContext, { pageId: "login-username.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { getClassName } = useGetClassName({
    doUseDefaultCss,
    classes,
  });

  const { social, realm, url, usernameHidden, login, registrationDisabled } = kcContext;

  const { msg, msgStr } = i18n;

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

  const onSubmit = useConstCallback<FormEventHandler<HTMLFormElement>>((e) => {
    e.preventDefault();

    setIsLoginButtonDisabled(true);

    const formElement = e.target as HTMLFormElement;

    //NOTE: Even if we login with email Keycloak expect username and password in
    //the POST request.
    formElement.querySelector("input[name='email']")?.setAttribute("name", "username");

    formElement.submit();
  });

  return (
    <Template
      {...{ kcContext, i18n, doUseDefaultCss, classes }}
      displayInfo={social.displayInfo}
      displayWide={realm.password && social.providers !== undefined}
      headerNode={msg("doLogIn")}
      infoNode={
        realm.password &&
        realm.registrationAllowed &&
        !registrationDisabled && (
          <div id="kc-registration">
            <span>
              {msg("noAccount")}
              <a tabIndex={6} href={url.registrationUrl}>
                {msg("doRegister")}
              </a>
            </span>
          </div>
        )
      }>
      <div
        id="kc-form"
        className={clsx(
          realm.password && social.providers !== undefined && getClassName("kcContentWrapperClass")
        )}>
        <div
          id="kc-form-wrapper"
          className={clsx(
            realm.password &&
              social.providers && [
                getClassName("kcFormSocialAccountContentClass"),
                getClassName("kcFormSocialAccountClass"),
              ]
          )}>
          {realm.password && (
            <form id="kc-form-login" onSubmit={onSubmit} action={url.loginAction} method="post">
              <div className={getClassName("kcFormGroupClass")}>
                {!usernameHidden &&
                  (() => {
                    const label = !realm.loginWithEmailAllowed
                      ? "username"
                      : realm.registrationEmailAsUsername
                      ? "email"
                      : "usernameOrEmail";

                    const autoCompleteHelper: typeof label = label === "usernameOrEmail" ? "username" : label;

                    return (
                      <>
                        <label htmlFor={autoCompleteHelper} className={getClassName("kcLabelClass")}>
                          {msg(label)}
                        </label>
                        <input
                          tabIndex={1}
                          id={autoCompleteHelper}
                          className={getClassName("kcInputClass")}
                          //NOTE: This is used by Google Chrome auto fill so we use it to tell
                          //the browser how to pre fill the form but before submit we put it back
                          //to username because it is what keycloak expects.
                          name={autoCompleteHelper}
                          defaultValue={login.username ?? ""}
                          type="text"
                          autoFocus={true}
                          autoComplete="off"
                        />
                      </>
                    );
                  })()}
              </div>
              <div className={clsx(getClassName("kcFormGroupClass"), getClassName("kcFormSettingClass"))}>
                <div id="kc-form-options">
                  {realm.rememberMe && !usernameHidden && (
                    <div className="checkbox">
                      <label>
                        <input
                          tabIndex={3}
                          id="rememberMe"
                          name="rememberMe"
                          type="checkbox"
                          {...(login.rememberMe === "on"
                            ? {
                                checked: true,
                              }
                            : {})}
                        />
                        {msg("rememberMe")}
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div id="kc-form-buttons" className={getClassName("kcFormGroupClass")}>
                <input
                  tabIndex={4}
                  className={clsx(
                    getClassName("kcButtonClass"),
                    getClassName("kcButtonPrimaryClass"),
                    getClassName("kcButtonBlockClass"),
                    getClassName("kcButtonLargeClass")
                  )}
                  name="login"
                  id="kc-login"
                  type="submit"
                  value={msgStr("doLogIn")}
                  disabled={isLoginButtonDisabled}
                />
              </div>
            </form>
          )}
        </div>
        {realm.password && social.providers !== undefined && (
          <div
            id="kc-social-providers"
            className={clsx(
              getClassName("kcFormSocialAccountContentClass"),
              getClassName("kcFormSocialAccountClass")
            )}>
            <ul
              className={clsx(
                getClassName("kcFormSocialAccountListClass"),
                social.providers.length > 4 && getClassName("kcFormSocialAccountDoubleListClass")
              )}>
              {social.providers.map((p) => (
                <li key={p.providerId} className={getClassName("kcFormSocialAccountListLinkClass")}>
                  <a href={p.loginUrl} id={`zocial-${p.alias}`} className={clsx("zocial", p.providerId)}>
                    <span>{p.displayName}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Template>
  );
}
