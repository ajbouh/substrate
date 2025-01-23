// Copyright 2015 Matthew Holt and The Caddy Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package caddytls

import (
	"bytes"
	"context"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"log/slog"
	"time"

	"github.com/caddyserver/certmagic"
	"github.com/smallstep/certificates/authority/provisioner"

	"github.com/ajbouh/substrate/images/substrate/caddy"
	"github.com/ajbouh/substrate/images/substrate/caddy/caddypki"
)

// InternalIssuer is a certificate issuer that generates
// certificates internally using a locally-configured
// CA which can be customized using the `pki` app.
type InternalIssuer struct {
	// The ID of the CA to use for signing. The default
	// CA ID is "local". The CA can be configured with the
	// `pki` app.
	CA string `json:"ca,omitempty"`

	// The validity period of certificates.
	Lifetime caddy.Duration `json:"lifetime,omitempty"`

	// If true, the root will be the issuer instead of
	// the intermediate. This is NOT recommended and should
	// only be used when devices/clients do not properly
	// validate certificate chains.
	SignWithRoot bool `json:"sign_with_root,omitempty"`

	PKI    *caddypki.PKI
	Logger *slog.Logger

	ca *caddypki.CA
}

// Provision sets up the issuer.
func (iss *InternalIssuer) Initialize() {
	// set some defaults
	if iss.CA == "" {
		iss.CA = caddypki.DefaultCAID
	}

	ctx := context.TODO()
	ca, err := iss.PKI.GetCA(ctx, iss.CA)
	if err != nil {
		panic(fmt.Errorf("error getting ca: %w", err))
	}
	iss.ca = ca

	// set any other default values
	if iss.Lifetime == 0 {
		iss.Lifetime = caddy.Duration(defaultInternalCertLifetime)
	}
}

// IssuerKey returns the unique issuer key for the
// configured CA endpoint.
func (iss InternalIssuer) IssuerKey() string {
	return iss.ca.ID
}

// Issue issues a certificate to satisfy the CSR.
func (iss InternalIssuer) Issue(ctx context.Context, csr *x509.CertificateRequest) (*certmagic.IssuedCertificate, error) {
	iss.Logger.Info("InternalIssuer.Issue", "csr", csr)

	// prepare the signing authority
	authCfg := caddypki.AuthorityConfig{
		SignWithRoot: iss.SignWithRoot,
	}
	auth, err := iss.ca.NewAuthority(authCfg)
	if err != nil {
		return nil, err
	}

	// get the cert (public key) that will be used for signing
	var issuerCert *x509.Certificate
	if iss.SignWithRoot {
		issuerCert = iss.ca.RootCertificate()
	} else {
		issuerCert = iss.ca.IntermediateCertificate()
	}

	// ensure issued certificate does not expire later than its issuer
	lifetime := time.Duration(iss.Lifetime)
	if time.Now().Add(lifetime).After(issuerCert.NotAfter) {
		lifetime = time.Until(issuerCert.NotAfter)
		iss.Logger.Warn("cert lifetime would exceed issuer NotAfter, clamping lifetime",
			"orig_lifetime", time.Duration(iss.Lifetime),
			"lifetime", lifetime,
			"not_after", issuerCert.NotAfter,
		)
	}

	certChain, err := auth.SignWithContext(ctx, csr, provisioner.SignOptions{}, customCertLifetime(caddy.Duration(lifetime)))
	if err != nil {
		return nil, err
	}

	var buf bytes.Buffer
	for _, cert := range certChain {
		err := pem.Encode(&buf, &pem.Block{Type: "CERTIFICATE", Bytes: cert.Raw})
		if err != nil {
			return nil, err
		}
	}

	return &certmagic.IssuedCertificate{
		Certificate: buf.Bytes(),
	}, nil
}

// customCertLifetime allows us to customize certificates that are issued
// by Smallstep libs, particularly the NotBefore & NotAfter dates.
type customCertLifetime time.Duration

func (d customCertLifetime) Modify(cert *x509.Certificate, _ provisioner.SignOptions) error {
	cert.NotBefore = time.Now()
	cert.NotAfter = cert.NotBefore.Add(time.Duration(d))
	return nil
}

const defaultInternalCertLifetime = 12 * time.Hour

// Interface guards
var (
	_ certmagic.Issuer                = (*InternalIssuer)(nil)
	_ provisioner.CertificateModifier = (*customCertLifetime)(nil)
)
