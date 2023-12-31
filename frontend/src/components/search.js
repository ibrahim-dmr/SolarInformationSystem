import React from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import {Paper, Typography, Grid, IconButton, Box, Container, Icon} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const Search = ({ panTo }) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {/* Konfigürasyon seçenekleri */},
        debounce: 300,
    });

    return (
        <Box sx={{ width: 300 }}>
        <Autocomplete
            freeSolo
            disableClearable
            options={data.map((suggestion) => suggestion.description)}
            loading={status === "LOADING"}
            value={value}
            onChange={async (event, newValue) => {
                setValue(newValue, false);
                clearSuggestions();
                try {
                    const results = await getGeocode({ address: newValue });
                    const { lat, lng } = await getLatLng(results[0]);
                    panTo({ lat, lng });
                } catch (error) {
                    console.log("Error: ", error);
                }
            }}
            onInputChange={(event, newInputValue) => {
                setValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    sx={{
                        width: 290,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#808080', // Kenarlık rengi olarak gri
                            },
                            '&:hover fieldset': {
                                borderColor: '#808080', // Üzerine gelindiğinde kenarlık rengi
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#808080', // Odaklandığında kenarlık rengi
                            },
                        },
                        '& label.Mui-focused': {
                            color: 'black', // Odaklandığında etiket rengi
                        },
                        '& label': {
                            color: 'black', // Normal etiket rengi
                        },
                    }}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <>
                                {status === "LOADING" ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
        </Box>
    );
};

export default Search;
