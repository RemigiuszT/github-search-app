import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SearchIcon from "@mui/icons-material/Search";

interface SearchFormProps {
  onSearch: (value: string) => void;
}

interface FormData {
  username: string;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .matches(/^[a-zA-Z0-9-]+$/, "Dozwolone tylko litery, cyfry i myślnik.")
    .max(39, "Nazwa użytkownika nie może przekraczać 39 znaków.")
    .required("Pole jest wymagane"),
});

const DEBOUNCE_TIME = 2000;

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const { control, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { username: "" },
  });

  const username = watch("username");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(username);
    }, DEBOUNCE_TIME);

    return () => clearTimeout(handler);
  }, [username, onSearch]);

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <Controller
        name="username"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Nazwa użytkownika"
            variant="outlined"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error ? fieldState.error.message : ""}
            margin="normal"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        onSearch(username);
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />
    </form>
  );
};

export default SearchForm;
