<#import "template.ftl" as layout>
<@layout.emailLayout>
    <tr>
      <td style="padding-top: 40px;">
        <img
            alt=""
            src="https://assets.plan4better.de/img/email/reset_password.png"
            style="width: 250px"
        />
      </td>
    </tr>
    <tr>
      <td>
        <div style="${properties.titleStyle}">
          <h2>${msg("identityProviderLinkTitle")}</h2>
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <div
          style="${properties.infoContentStyle}"
        >
            ${kcSanitize(msg("identityProviderLinkBodyHtml", identityProviderDisplayName, realmName, identityProviderContext.username, link, linkExpiration, linkExpirationFormatter(linkExpiration)))?no_esc}
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <a
          href="${link}"
          style="${properties.actionButtonStyle}"
        >
          <b style="font-weight: 700">${msg("identityProviderLinkButton")}</b>
        </a>
      </td>
    </tr>
</@layout.emailLayout>