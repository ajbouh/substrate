package substrate

import "encoding/json"

func deepCloneViaJSON(dst, src interface{}) error {
	b, err := json.Marshal(src)
	if err != nil {
		return err
	}
	err = json.Unmarshal(b, &dst)
	if err != nil {
		return err
	}
	return nil
}
