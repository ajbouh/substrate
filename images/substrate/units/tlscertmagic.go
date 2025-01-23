package units

import (
	"context"
	"crypto"
	"crypto/rand"
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"log/slog"
	"net"
	"net/url"
	"strings"

	"github.com/ajbouh/substrate/images/substrate/caddy/caddytls"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/caddyserver/certmagic"

	"golang.org/x/net/idna"

	"github.com/klauspost/cpuid/v2"
)

// Use certmagic to create and validate ssl certificates
type CertMagicTLSConfig struct {
	DomainNames []string
	// Config      *certmagic.Config
	// PKI *caddypki.PKI
	InternalIssuer *caddytls.InternalIssuer
}

var _ httpframework.TLSConfig = (*CertMagicTLSConfig)(nil)

// Constants for PKIX MustStaple extension.
var (
// tlsFeatureExtensionOID = asn1.ObjectIdentifier{1, 3, 6, 1, 5, 5, 7, 1, 24}
// ocspMustStapleFeature  = []byte{0x30, 0x03, 0x02, 0x01, 0x05}
//
//	mustStapleExtension    = pkix.Extension{
//		Id:    tlsFeatureExtensionOID,
//		Value: ocspMustStapleFeature,
//	}
)

// generateCSR generates a CSR for the given SANs. If useCN is true, CommonName will get the first SAN (TODO: this is only a temporary hack for ZeroSSL API support).
func generateCSR(privateKey crypto.PrivateKey, sans []string, useCN bool) (*x509.CertificateRequest, error) {
	csrTemplate := new(x509.CertificateRequest)

	for _, name := range sans {
		// identifiers should be converted to punycode before going into the CSR
		// (convert IDNs to ASCII according to RFC 5280 section 7)
		normalizedName, err := idna.ToASCII(name)
		if err != nil {
			return nil, fmt.Errorf("converting identifier '%s' to ASCII: %v", name, err)
		}

		// TODO: This is a temporary hack to support ZeroSSL API...
		if useCN && csrTemplate.Subject.CommonName == "" && len(normalizedName) <= 64 {
			csrTemplate.Subject.CommonName = normalizedName
			continue
		}

		if ip := net.ParseIP(normalizedName); ip != nil {
			csrTemplate.IPAddresses = append(csrTemplate.IPAddresses, ip)
		} else if strings.Contains(normalizedName, "@") {
			csrTemplate.EmailAddresses = append(csrTemplate.EmailAddresses, normalizedName)
		} else if u, err := url.Parse(normalizedName); err == nil && strings.Contains(normalizedName, "/") {
			csrTemplate.URIs = append(csrTemplate.URIs, u)
		} else {
			csrTemplate.DNSNames = append(csrTemplate.DNSNames, normalizedName)
		}
	}

	// if cfg.MustStaple {
	// 	csrTemplate.ExtraExtensions = append(csrTemplate.ExtraExtensions, mustStapleExtension)
	// }

	// IP addresses aren't printed here because I'm too lazy to marshal them as strings, but
	// we at least print the incoming SANs so it should be obvious what became IPs
	slog.Info("created CSR",
		"identifiers", sans,
		"san_dns_names", csrTemplate.DNSNames,
		"san_emails", csrTemplate.EmailAddresses,
		"common_name", csrTemplate.Subject.CommonName,
		"extra_extensions", len(csrTemplate.ExtraExtensions),
	)

	csrDER, err := x509.CreateCertificateRequest(rand.Reader, csrTemplate, privateKey)
	if err != nil {
		return nil, err
	}

	return x509.ParseCertificateRequest(csrDER)
}

func (c *CertMagicTLSConfig) FrameworkTLSConfig() (*tls.Config, error) {
	keygen := &certmagic.StandardKeyGenerator{
		KeyType: certmagic.RSA2048,
	}
	pkey, err := keygen.GenerateKey()
	if err != nil {
		return nil, err
	}

	csr, err := generateCSR(pkey, c.DomainNames, false)
	if err != nil {
		return nil, err
	}

	issued, err := c.InternalIssuer.Issue(context.TODO(), csr)
	if err != nil {
		return nil, err
	}

	pkeyPEM, err := certmagic.PEMEncodePrivateKey(pkey)
	if err != nil {
		return nil, err
	}

	cert, err := tls.X509KeyPair(issued.Certificate, pkeyPEM)
	if err != nil {
		return nil, err
	}

	return &tls.Config{
		Certificates: []tls.Certificate{cert},

		// the rest recommended for modern TLS servers
		MinVersion: tls.VersionTLS12,
		CurvePreferences: []tls.CurveID{
			tls.X25519,
			tls.CurveP256,
		},
		CipherSuites:             preferredDefaultCipherSuites(),
		PreferServerCipherSuites: true,
	}, nil
}

// preferredDefaultCipherSuites returns an appropriate
// cipher suite to use depending on hardware support
// for AES-NI.
//
// See https://github.com/mholt/caddy/issues/1674
func preferredDefaultCipherSuites() []uint16 {
	if cpuid.CPU.Supports(cpuid.AESNI) {
		return defaultCiphersPreferAES
	}
	return defaultCiphersPreferChaCha
}

var (
	defaultCiphersPreferAES = []uint16{
		tls.TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,
		tls.TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
		tls.TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,
		tls.TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,
		tls.TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,
		tls.TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,
	}
	defaultCiphersPreferChaCha = []uint16{
		tls.TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,
		tls.TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,
		tls.TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,
		tls.TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
		tls.TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,
		tls.TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,
	}
)
