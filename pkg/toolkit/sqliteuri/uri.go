package sqliteuri

import (
	"fmt"
	"net/url"
	"reflect"
	"slices"
	"strconv"
	"strings"
)

type URI struct {
	FileName string

	URIOptions
}

func (uri *URI) Clone() URI {
	clone := *uri
	clone.URIOptions.Extras = slices.Clone(uri.URIOptions.Extras)
	return clone
}

func (uri *URI) String() string {
	return "file:" + uri.FileName + "?" + uri.URIOptions.String()
}

type Cache string

// "shared" is equivalent to setting the SQLITE_OPEN_SHAREDCACHE bit in the flags argument passed to sqlite3_open_v2()
const CacheShared Cache = "shared"

// "private" is equivalent to setting the SQLITE_OPEN_PRIVATECACHE bit.
const CachePrivate Cache = "private"

type Mode string

// The database is opened for read-only access, just as if the SQLITE_OPEN_READONLY flag had been set in the third argument to sqlite3_open_v2().
const ModeReadOnly Mode = "ro"

// If the mode option is set to "rw", then the database is opened for read-write (but not create) access, as if SQLITE_OPEN_READWRITE (but not SQLITE_OPEN_CREATE) had been set.
const ModeReadWrite Mode = "rw"

// Value "rwc" is equivalent to setting both SQLITE_OPEN_READWRITE and SQLITE_OPEN_CREATE.
const ModeReadWriteCreate Mode = "rwc"

// If the mode option is set to "memory" then a pure in-memory database that never reads or writes from disk is used.
const ModeMemory Mode = "memory"

type AutoVacuum string

const AutoVacuumNone AutoVacuum = "none"
const AutoVacuumFull AutoVacuum = "full"
const AutoVacuumIncremental AutoVacuum = "incremental"

type Bool string

const True Bool = "true"
const False Bool = "false"

type Synchronous string

const SynchronousOff Synchronous = "OFF"
const SynchronousNormal Synchronous = "NORMAL"
const SynchronousFull Synchronous = "FULL"
const SynchronousExtra Synchronous = "EXTRA"

type MutexMode string

const MutexModeNo MutexMode = "no"
const MutexModeFull MutexMode = "full"

type SecureDelete string

const SecureDeleteYes SecureDelete = "true"
const SecureDeleteNo SecureDelete = "false"
const SecureDeleteFast SecureDelete = "fast"

type JournalMode string

const JournalModeDelete JournalMode = "DELETE"
const JournalModeTruncate JournalMode = "TRUNCATE"
const JournalModePersist JournalMode = "PERSIST"
const JournalModeMemory JournalMode = "MEMORY"
const JournalModeWAL JournalMode = "WAL"
const JournalModeOff JournalMode = "OFF"

type LockingMode string

const LockingModeNormal LockingMode = "NORMAL"
const LockingModeExclusive LockingMode = "EXCLUSIVE"

type Crypt string

const CryptSHA1 Crypt = "SHA1"
const CryptSSHA1 Crypt = "SSHA1"
const CryptSHA256 Crypt = "SHA256"
const CryptSSHA256 Crypt = "SSHA256"
const CryptSHA384 Crypt = "SHA384"
const CryptSSHA384 Crypt = "SSHA384"
const CryptSHA512 Crypt = "SHA512"
const CryptSSHA512 Crypt = "SSHA512"

type TxLock string

const TxLocImmediate TxLock = "immediate"
const TxLocDeferred TxLock = "deferred"
const TxLocExclusive TxLock = "exclusive"

type Int string

func AsInt(i int) Int {
	return Int(strconv.Itoa(i))
}

type ExtraURIOption struct {
	Name  string
	Value string
}

type URIOptions struct {
	VFS       string `query:"vfs"`       // The "vfs" parameter may be used to specify the name of a VFS object that provides the operating system interface that should be used to access the database file on disk. If this option is set to an empty string the default VFS object is used. Specifying an unknown VFS is an error. If sqlite3_open_v2() is used and the vfs option is present, then the VFS specified by the option takes precedence over the value passed as the fourth parameter to sqlite3_open_v2().
	Mode      Mode   `query:"mode"`      // It is an error to specify a value for the mode parameter that is less restrictive than that specified by the flags passed in the third parameter to sqlite3_open_v2().
	Cache     Cache  `query:"cache"`     // If sqlite3_open_v2() is used and the "cache" parameter is present in a URI filename, its value overrides any behavior requested by setting SQLITE_OPEN_PRIVATECACHE or SQLITE_OPEN_SHAREDCACHE flag.
	PSOW      Bool   `query:"psow"`      // The psow parameter indicates whether or not the powersafe overwrite property does or does not apply to the storage media on which the database file resides.
	NoLock    Bool   `query:"nolock"`    // The nolock parameter is a boolean query parameter which if set disables file locking in rollback journal modes. This is useful for accessing a database on a filesystem that does not support locking. Caution: Database corruption might result if two or more processes write to the same database and any one of those processes uses nolock=1.
	Immutable Bool   `query:"immutable"` // The immutable parameter is a boolean query parameter that indicates that the database file is stored on read-only media. When immutable is set, SQLite assumes that the database file cannot be changed, even by a process with higher privilege, and so the database is opened read-only and all locking and change detection is disabled. Caution: Setting the immutable property on a database file that does in fact change can result in incorrect query results and/or SQLITE_CORRUPT errors. See also: SQLITE_IOCAP_IMMUTABLE.

	// _auth // UA -" Create; Create User Authentication, for more information see User Authentication
	AuthUser               string      `query:"_auth_user"`                // UA - Username; Username for User Authentication, for more information see User Authentication
	AuthPass               string      `query:"_auth_pass"`                // UA - Password; Password for User Authentication, for more information see User Authentication
	AuthCrypt              Crypt       `query:"_auth_crypt"`               // UA - Crypt; Password encoder to use for User Authentication, for more information see User Authentication
	AuthSalt               string      `query:"_auth_salt"`                // UA - Salt; Salt to use if the configure password encoder requires a salt, for User Authentication, for more information see User Authentication
	AutoVacuum             AutoVacuum  `query:"_auto_vacuum"`              // Auto Vacuum; For more information see PRAGMA autoVacuum
	BusyTimeout            Int         `query:"_busy_timeout"`             // Busy Timeout; Specify value for sqlite3_busy_timeout. For more information see PRAGMA busy_timeout
	CaseSensitiveLike      Bool        `query:"_case_sensitive_like"`      // Case Sensitive LIKE; For more information see PRAGMA case_sensitive_like
	DeferForeignKeys       Bool        `query:"_defer_foreign_keys"`       // Defer Foreign Keys; For more information see PRAGMA defer_foreign_keys
	ForeignKeys            Bool        `query:"_foreign_keys"`             // Foreign Keys; For more information see PRAGMA foreign_keys
	IgnoreCheckConstraints Bool        `query:"_ignore_check_constraints"` // Ignore CHECK Constraints; For more information see PRAGMA ignore_check_constraints
	JournalMode            JournalMode `query:"_journal_mode"`             // Journal Mode; For more information see PRAGMA journal_mode
	LockingMode            LockingMode `query:"_locking_mode"`             // Locking Mode; For more information see PRAGMA locking_mode
	Mutex                  MutexMode   `query:"_mutex"`                    // Mutex Locking; Specify mutex mode.
	QueryOnly              Bool        `query:"_query_only"`               // Query Only; For more information see PRAGMA query_only
	RecursiveTriggers      Bool        `query:"_recursive_triggers"`       // Recursive Triggers; For more information see PRAGMA recursive_triggers
	SecureDelete           Bool        `query:"_secure_delete"`            // Secure Delete; For more information see PRAGMA secure_delete
	Synchronous            Synchronous `query:"_synchronous"`              // Synchronous; For more information see PRAGMA synchronous

	// _loc TZLocation `query:"_loc"` // Time Zone Location; Specify location of time format.
	Txlock         TxLock `query:"_txlock"`          // Transaction Lock; Specify locking behavior for transactions.
	WritableSchema Bool   `query:"_writable_schema"` // Writable Schema; When this pragma is on, the SQLITE_MASTER tables in which database can be changed using ordinary UPDATE, INSERT, and DELETE statements. Warning: misuse of this pragma can easily result in a corrupt database file.
	CacheSize      Int    `query:"_cache_size"`      // Cache Size; Maximum cache size; default is 2000K (2M). See PRAGMA cache_size

	Extras []ExtraURIOption
}

func (opts *URIOptions) String() string {
	r := reflect.ValueOf(*opts)

	var options []string
	for i := 0; i < r.NumField(); i++ {
		// Get the field tag value
		tag := r.Type().Field(i).Tag.Get("query")

		// Skip if tag is not defined or ignored
		if tag == "" || tag == "-" {
			continue
		}

		field := r.Field(i)
		var value string
		switch field.Type().Kind() {
		case reflect.String:
			value = field.String()
		case reflect.Int:
			value = strconv.Itoa(int(field.Int()))
		default:
			panic(fmt.Errorf("unexpected field type kind: %#v", field))
		}

		if value != "" {
			options = append(options, tag+"="+url.QueryEscape(value))
		}
	}

	for _, extra := range opts.Extras {
		options = append(options, extra.Name+"="+url.QueryEscape(extra.Value))
	}

	return strings.Join(options, "&")
}
